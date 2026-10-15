export interface UserType {
    userId: string;
    firebaseUID: string;
    email: string;
    name: string;
    profileImage: string;
}

export interface UserResponse {
    status: boolean;
    message?: string;
    data?: {
        user: UserType;
    }
}


export interface ConversationType {
    _id: string
    title: string
    userId: string
    createdAt: Date
    updatedAt: Date
}

export interface MessageType {
    _id?: string;
    conversationId: string;
    role: "user" | "ai";
    content: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}