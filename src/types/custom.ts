export interface PatientPayload {
  id: string;
  uuid: string;
  username: string;
}

export interface CustomRequest {
  patient?: PatientPayload;
  [key: string]: any;
}

export interface customResponse {
  status: (code: number) => customResponse;
  json: (data: any) => void;
  [key: string]: any;
}
