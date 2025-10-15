export interface TypeDropdownItem {
    id: string,
    title: string
}

export interface TypeFormField {
    id: string,
    type: string,
    name: string,
    placeholder?: string,
    options?: TypeDropdownItem[],    // May change it later
    dataEndPoint?: string,
    require?: boolean,
    child?: TypeFormField
}

export interface TypeFile {
    uri: string,
    name: string,
    type: string,
}


export interface UserProfile {
    id: number,
    name: string,
    email: string,
    email_verified_at?: boolean,
    // username: string,
    company_id?: number,
    section_id?: number,
    parent_id?: number,
    description?: string,
    deleted_at?: string,
    photo?: string,
    roles: [
        {
            id: number,
            name: string,
            slug: string,
            description?: string,
            level: string   // TODO: this is number
        }
    ],
    token: string,
    type: string,
    // For login
    username: string,
    password: string,
    user_type: string,
}


export interface TypeLabTest {
    item: string,
    category: string,
    code?: string,
    collectionDate?: string,
    receivedDate?: string,
    mobileLab?: string,
}