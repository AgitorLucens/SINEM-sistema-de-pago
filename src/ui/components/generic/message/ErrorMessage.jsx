import { memo } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import './errormessage.css';
const ErrorMessage = memo(({ message }) => {
    return (
        <div className="error-message">
            <InfoCircledIcon size={18}/>
            <p>{message}</p>
        </div>
    );
});

export default ErrorMessage;