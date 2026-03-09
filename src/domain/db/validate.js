const ALLOWED_PAYMENT_FIELDS = [
        "date",
        "amount",
        "payment_method",
        "concept_id",
        "division_id",
        "student_id",
        "status",
        "month",
        "receipt"
];

const ALLOWED_EXPENSE_FIELDS = [
        "date",
        "description",
        "reference",
        "total_amount",
];

const ALLOWED_STUDENT_FIELDS = [
        "name",
        "reference",
        "phone",
        "email",
        "active",
        "scholarship",
        "scholarship_amount",
];

const ALLOWED_TEACHER_FIELDS = [
        "name",
        "division_id",
        "amount",
];


export function validatePaymentsUpdate(data){
    const { fields } = data;
    const keys = Object.keys(fields).filter(k =>
        ALLOWED_PAYMENT_FIELDS.includes(k)
    );
    
    if (!keys) return new Error("Intento de cambiar campo invalido");

    return keys;
}

export function validateExpensesUpdate(data){
    const { fields } = data;
    const keys = Object.keys(fields).filter(k =>
        ALLOWED_EXPENSE_FIELDS.includes(k)
    );
    
    if (!keys) return new Error("Intento de cambiar campo invalido");

    return keys;
}

export function validateStudentsUpdate(data){
    const { fields } = data;
    const keys = Object.keys(fields).filter(k =>
        ALLOWED_STUDENT_FIELDS.includes(k)
    );
    
    if (!keys) return new Error("Intento de cambiar campo invalido");

    return keys;
}

export function validateTeachersUpdate(data){
    const { fields } = data;
    const keys = Object.keys(fields).filter(k =>
        ALLOWED_TEACHER_FIELDS.includes(k)
    );
    
    if (!keys) return new Error("Intento de cambiar campo invalido");

    return keys;
}