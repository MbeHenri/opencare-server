interface Visit {
    type: string,
    startDate: Date,
    stopDate: Date,
    encounterDate: Date,
    observations: Array<{
        name: string;
        date: Date;
        value: any;
    }>,
    encounters: Array<{
        name: string;
        type: string;
    }>
}

export default Visit;