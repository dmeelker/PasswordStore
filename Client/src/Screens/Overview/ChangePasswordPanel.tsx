import React, { useEffect, useRef, useState } from "react";
import { Modal } from "../../Components/Modal";
import EntryService from "../../Model/EntryService";
import * as ApiService from "../../Services/ApiService";

interface FormValues {
    currentPassword: string;
    newPassword1: string;
    newPassword2: string;
}

interface ChangePasswordPanelProps {
    onClose: () => void;
}

export function ChangePasswordPanel(props: ChangePasswordPanelProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const currentPasswrodFieldRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Array<string>>()
    const [working, setWorking] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        await changePassword();
    }

    async function changePassword() {
        if (!formRef.current)
            return;

        const accountInfo = getAccountInfo(formRef.current);
        if (verifyFormValues(accountInfo)) {
            setWorking(true);
            try
            {
                await ApiService.changePassword(accountInfo.currentPassword, accountInfo.newPassword1);
                await EntryService.save();
                props.onClose();
            }
            catch(error) {
                setErrors([error.message]);
            }

            setWorking(false);
        }
    }

    function getAccountInfo(form: HTMLFormElement): FormValues {
        const formData = new FormData(form);
        return {
            currentPassword: formData.get("currentPassword") as string,
            newPassword1: formData.get("password1") as string,
            newPassword2: formData.get("password2") as string
        };
    }

    function verifyFormValues(values: FormValues) : boolean {
        const errors = new Array<string>();

        if (values.currentPassword.length == 0) {
            errors.push("Current password is required");
        }

        if (values.newPassword1.length == 0) {
            errors.push("New password is required");
        }

        if (values.newPassword1 !== values.newPassword2) {
            errors.push("The entered passwords do not match");
        }

        setErrors(errors);
        return errors.length == 0;
    }

    function okButtonPressed(event: React.MouseEvent) {
        event.preventDefault();

        changePassword();
    }

    function cancelButtonPressed(event: React.MouseEvent) {
        event.preventDefault();
        props.onClose();
    }

    useEffect(() => currentPasswrodFieldRef.current?.focus(), []);

    return <Modal title="Change password"
                buttonBar={<>
                    <button className="btn-primary" onClick={okButtonPressed}>Ok</button>
                    <button className="btn-secondary" onClick={cancelButtonPressed}>Cancel</button>
                </>}>
        <form onSubmit={handleSubmit} ref={formRef}>
            {errors?.map(error => <div key={error} className="text-red-600">{error}</div>)}
            <FormRow label="Current password" index={0}>
                <input type="password" name="currentPassword" placeholder="Current password" required className="text-input w-full" disabled={working} ref={currentPasswrodFieldRef}/>
            </FormRow>

            <FormRow label="New password" index={0}>
                <input type="password" name="password1" placeholder="New password" required className="text-input w-full" disabled={working}/>
            </FormRow>

            <FormRow label="Repeat new password" index={0}>
                <input type="password" name="password2" placeholder="Repeat new password" required className="text-input w-full" disabled={working}/>
            </FormRow>
        </form>
    </Modal>
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