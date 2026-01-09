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