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


function filterAllowedFields(data, allowedFields) {
    if (!data || typeof data.fields !== "object" || data.fields === null) return null;

    const keys = Object.keys(data.fields).filter(k => allowedFields.includes(k));
    if (keys.length === 0) return null;

    return keys;
}

export function validatePaymentsUpdate(data){
    return filterAllowedFields(data, ALLOWED_PAYMENT_FIELDS);
}

export function validateExpensesUpdate(data){
    return filterAllowedFields(data, ALLOWED_EXPENSE_FIELDS);
}

export function validateStudentsUpdate(data){
    return filterAllowedFields(data, ALLOWED_STUDENT_FIELDS);
}

export function validateTeachersUpdate(data){
    return filterAllowedFields(data, ALLOWED_TEACHER_FIELDS);
}