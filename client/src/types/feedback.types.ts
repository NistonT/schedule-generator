export interface IAddFeedback {
	title: string;
	text: string;
}

export interface IAdminFeedback {
	feedback_admin: string;
	isCheck: boolean;
	admin: string;
}

export interface IChangeFeedback {
	title?: string;
	text?: string;
	feedback_admin?: string;
	admin?: string;
	isCheck?: boolean;
}

export interface IFeedback {
	id: string;
	user_id: string;
	title: string;
	text: string;
	feedback_admin: string;
	admin: string;
	isCheck: boolean;
	CreatedAt: string;
	UpdatedAt: string;
}
