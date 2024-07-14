import { Request, Response } from "express";
import { RoomModel } from "../models/Room";
import { PatientModel } from "../models/Patient";
import { facturation_rep, hospital_rep, room_rep } from "../repositories";
import { AppointmentModel, StatusAppointmentDict } from "../models/Appointment";
import { DemandInput, DemandModel, StatusDemandDict } from "../models/Demand";


class AppointmentController {

    async setInvoiceToPay(req: Request, res: Response) {
        try {
            const invoice_id = req.params.id

            await facturation_rep.payInvoice(invoice_id)
            const invoice = await facturation_rep.getInvoice(invoice_id)

            res.status(200).send({ date: invoice.date, state: invoice.payment_state, currency: invoice.currency_id[1], amount_total: invoice.amount_total });
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }


    async updateDoctorAppointment(req: Request, res: Response) {
        try {
            const uuidAppointment = req.params.id
            const { doctor_id } = req.body

            if (!doctor_id) {
                throw new Error("give doctor id");
            }

            let appointment = await AppointmentModel.findOne({
                uuidAppointment
            });

            if (appointment) {

                // actualisation du nouveau docteur dans l'hopital

                const doctor = "";


                // recherche de l'espace de communication entre le nouveau docteur et le patient
                const uuidDoctor = doctor_id
                const uuidPatient = appointment.uuidPatient

                const room = await RoomModel.findOne({
                    uuidDoctor,
                    uuidPatient,
                })

                let tokenRoom = "";
                if (!room) {
                    // recuperation du patient
                    const patient = await PatientModel.findOne({ uuid: appointment.uuidPatient })
                    if (!patient) {
                        throw new Error("patient don't exist");
                    }

                    // recuperation du docteur depuis appointment
                    const doctor = await hospital_rep.getDoctor(uuidDoctor)

                    // creation de l'espace de communication
                    tokenRoom = (await room_rep.createRoom(`Consultation (${doctor.person.display} / ${patient.person.display}) `)).token

                    // construction des comptes Talk du docteur et du patient si néccessaire
                    await room_rep.addParticipant(patient.username, patient.person.display, tokenRoom)
                    await room_rep.addParticipant(doctor.username, doctor.person.display, tokenRoom)

                    await RoomModel.create({
                        uuidPatient,
                        uuidDoctor,
                        tokenRoom,
                    })
                } else {
                    tokenRoom = room.tokenRoom
                }
                // actualisation de l'espace de rencontre
                await appointment.updateOne(
                    {
                        $set: { tokenRoom }
                    }
                )
                res.status(201).json(doctor);

            } else {
                res.status(404).json({ message: "room service don't exist" });
            }
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }

    async payAppointment(req: Request, res: Response) {
        try {
            const uuidAppointment = req.params.id
            const appointment = await AppointmentModel.findOne({ uuidAppointment });

            if (appointment) {

                if (appointment.status == StatusAppointmentDict['unpay']) {

                    let tokenRoom = appointment.tokenRoom

                    // recupération de l'appointment depuis l'hospital (uuid et details du service doivent etre obtenu)
                    const appointment_h = await hospital_rep.getAppointement(appointment.uuidAppointment);
                    const doctor_uuid = appointment_h.providers[0].uuid


                    // éléments de l'hopital
                    const service = {
                        uuid: appointment_h.service.uuid,
                        name: appointment_h.service.name,
                    }
                    const startDateTime = new Date(appointment_h.startDateTime)
                    const endDateTime = new Date(appointment_h.endDateTime)


                    if (tokenRoom == "") {

                        // recuperation de la rencontre depuis l'hopital
                        const uuidPatient = appointment.uuidPatient
                        const uuidDoctor = doctor_uuid

                        const room = await RoomModel.findOne({
                            uuidDoctor,
                            uuidPatient
                        })

                        if (!room) {
                            // recuperation du patient
                            const patient = await PatientModel.findOne({ uuid: appointment.uuidPatient })
                            if (!patient) {
                                throw new Error("patient don't exist");
                            }

                            // recuperation du docteur depuis appointment
                            const doctor = await hospital_rep.getDoctor(uuidDoctor)

                            // creation de l'espace de communication
                            tokenRoom = (await room_rep.createRoom(`Consultation (${doctor.person.display} / ${patient.person.display}) `)).token

                            // construction des comptes Talk du docteur et du patient si néccessaire
                            await room_rep.addParticipant(patient.username, patient.person.display, tokenRoom)
                            await room_rep.addParticipant(doctor.username, doctor.person.display, tokenRoom)

                            await RoomModel.create({
                                uuidPatient,
                                uuidDoctor,
                                tokenRoom,
                            })
                        } else {
                            tokenRoom = room.tokenRoom
                        }
                    }

                    // on met la facture à l'état payé
                    await facturation_rep.payInvoice(appointment.idInvoice)

                    // signaler que le service a été payé et qu'un espace de consultation a été crée
                    await appointment.updateOne({ $set: { status: StatusAppointmentDict['pay'], tokenRoom } })

                    // on signale à l'hopital que la rencontre peut s'afficher
                    await hospital_rep.setAppointement(appointment.uuidAppointment, appointment.uuidPatient, service.uuid, "", startDateTime, endDateTime, 'Scheduled')

                    res.status(201).json({ status: StatusAppointmentDict['pay'], tokenRoom });

                } else {
                    res.status(202).json({ status: appointment.status, tokenRoom: appointment.tokenRoom });
                }
            } else {
                res.status(404).json({ message: "appointment don't exist" });
            }
        } catch (error) {
            const err: any = error
            res.status(405).send({ name: err.name, message: err.message });
        }
    }
}

export default AppointmentController;
