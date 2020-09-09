import React, { useState } from "react";
import { alternatingClass } from "../../Utilities/RenderHelpers";
import { setServers } from "dns";
import * as ApiService from "../../Services/ApiService";

interface FormValues {
    accountName: string,
    password1: string,
    password2: string
}

interface RegisterScreenProps {
    onClose: () => void;
}

export function RegisterScreen(props: RegisterScreenProps) {
    const [errors, setErrors] = useState<Array<string>>()
    const [working, setWorking] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const accountInfo = getAccountInfo(event.target as HTMLFormElement);
        if (verifyFormValues(accountInfo)) {
            setWorking(true);
            try
            {
                await ApiService.register(accountInfo.accountName, accountInfo.password1);
                props.onClose();
            }
            catch(error) {
                setErrors([error.message]);
            }

            setWorking(false);
        }
    }

    function onCancelButtonPressed(event: React.MouseEvent) {
        event.preventDefault();
        props.onClose();
    }

    function getAccountInfo(form: HTMLFormElement): FormValues {
        const formData = new FormData(form);
        return {
            accountName: formData.get("accountName") as string,
            password1: formData.get("password1") as string,
            password2: formData.get("password2") as string
        };
    }

    function verifyFormValues(values: FormValues) : boolean {
        const errors = new Array<string>();

        if (values.accountName.length == 0) {
            errors.push("Account name is required");
        }

        if (values.password1.length == 0) {
            errors.push("Password is required");
        }

        if (values.password1 !== values.password2) {
            errors.push("The entered passwords do not match");
        }

        setErrors(errors);
        return errors.length == 0;
    }

    return (
        <div className="h-full flex">
            <div className="bg-white shadow p-4 m-auto" style={{width: 500}}>
                <form onSubmit={handleSubmit}>
                    {errors?.map(error => <div key={error} className="text-red-600">{error}</div>)}
                    <FormRow label="Account name" index={0}>
                        <input type="text" name="accountName" placeholder="Account name" required className="text-input w-full" disabled={working}/>
                    </FormRow>

                    <FormRow label="Password" index={0}>
                        <input type="password" name="password1" placeholder="Password" required className="text-input w-full" disabled={working}/>
                    </FormRow>

                    <FormRow label="Repeat password" index={0}>
                        <input type="password" name="password2" placeholder="Repeat password" required className="text-input w-full" disabled={working}/>
                    </FormRow>

                    <div className="button-bar-right mt-4">
                        <button type="submit" className="btn btn-primary" disabled={working}>{working ? "Working!" : "Register"}</button>
                        <button type="submit" className="btn btn-secondary" onClick={onCancelButtonPressed} disabled={working}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface FormRowProps {
    index: number;
    label: string;
    children: any;
}

function FormRow(props: FormRowProps) {
    return (
        <label className="block mb-2">{props.label}<br/>
            {props.children}
        </label>
    );
}