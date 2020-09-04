import { useState, useEffect } from "react";
import React from "react";
import { FaEye } from "react-icons/fa";

interface PasswordFieldProps {
    password?: string;
    readonly?: boolean;
    required?: boolean;
    onChange?: (password: string) => void;
}

export function PasswordField(props: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState(props.password ?? "");

    useEffect(() => {
        if(props.password) {
            setPassword(props.password);
        }
    }, [props.password]);

    function passwordChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newPassword = event.target.value;
        setPassword(newPassword);
        
        if(props.onChange){
            props.onChange(newPassword);
        }
    }

    function togglePasswordShown() {
        setShowPassword(!showPassword);
    }

    return <div className="flex flex-row">
        <input type={showPassword ? "text": "password"} name="password" 
            className="text-input flex-1 border-l border-t border-b border-r-0 border-gray-500 rounded-none rounded-tl rounded-bl" 
            value={password} onChange={passwordChanged} required={props.required} readOnly={props.readonly}/>
        <button type="button" 
            className="btn border-l-0 border-t border-b border-r border-gray-500 rounded-none rounded-tr rounded-br px-3 y py-1" 
            onClick={togglePasswordShown}><FaEye/></button>
    </div>;
}