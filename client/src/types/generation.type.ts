export interface IAddField {
	name: string;
}

export interface IPutField {
	oldName: string;
	newName: string;
}

export interface IDeleteField {
	name: string;
}

export interface IPutFieldNumber {
	teacherId: number;
	newName: string;
}

export interface IDeleteFieldNumber {
	teacherId: number;
}
