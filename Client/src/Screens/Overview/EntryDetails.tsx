import React, { useEffect } from 'react';
import { PasswordEntry, HistoryEntry } from '../../Model/Model';
import { alternatingClass } from '../../Utilities/RenderHelpers';
import { FaEye } from 'react-icons/fa';
import { Tabs, Tab } from '../../Components/Tabs';
import { ListView, ListViewItem } from '../../Components/ListView';
import { PasswordGeneratorDialog } from './PasswordGeneratorDialog';
import { Modal } from '../../Components/Modal';
import { PasswordField } from '../../Components/PasswordField';

interface EntryDetailsProp {
    entry: PasswordEntry;
    savePressed: () => any;
    cancelPressed: () => any;
}

interface FormValues {
    name: string;
    url: string;
    username: string;
    password: string;
}

export function EntryDetails(props: EntryDetailsProp) {
    const entry = props.entry;
    const [showPassword, setShowPassword] = React.useState(false);
    const [password, setPassword] = React.useState(entry.password);
    const [showPasswordGenerator, setShowPasswordGenerator] = React.useState(false);
    const firstField = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        firstField.current?.focus();
    }, []);

    function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formValues = getFormValues(event.target as HTMLFormElement);
        if (!valuesEqualEntry(formValues, entry)) {
            updateEntry(entry, formValues);
            props.savePressed();
        } else {
            props.cancelPressed();
        }
    };

    function getFormValues(form: HTMLFormElement): FormValues {
        const formData = new FormData(form);
        return {
            name: formData.get("name") as string,
            url: formData.get("url") as string,
            username: formData.get("username") as string,
            password: formData.get("password") as string
        };
    }

    function valuesEqualEntry(values: FormValues, entry: PasswordEntry): boolean {
        return entry.name === values.name &&
            entry.url === values.url &&
            entry.username === values.username &&
            entry.password === values.password;
    }

    function updateEntry(entry: PasswordEntry, formValues: FormValues) {
        entry.name = formValues.name;
        entry.url = formValues.url;
        entry.username = formValues.username;
        entry.password = formValues.password;
    }

    function cancelButtonPressed(event: React.MouseEvent) {
        props.cancelPressed();
        event.preventDefault();
    };

    function togglePasswordShown(event: React.MouseEvent) {
        setShowPassword(!showPassword);
        event.preventDefault();
    };

    function generatePassword(event: React.MouseEvent) {
        setShowPasswordGenerator(true);
        event.preventDefault();
    };

    let rowIndex = 0;

    return (
        <Modal title="Entry Details"
            buttonBar={<>
                <button type="submit" className="btn-primary" form="detailsForm">Save</button>
                <button type="button" className="btn-secondary" onClick={cancelButtonPressed}>Cancel</button>
            </>}>
            <div style={{maxWidth: 600, width: "100vw"}}>
                <form id="detailsForm" onSubmit={onFormSubmit}>
                    <Tabs>
                        <Tab id="entry" title="Entry" isMain={true}>
                            <div className="leading-8">
                                <FormRow index={rowIndex++} label="Name">
                                    <input type="text" name="name" className="text-input w-full" defaultValue={props.entry.name} autoComplete="off" ref={firstField} required/>
                                </FormRow>

                                <FormRow index={rowIndex++} label="URL">
                                    <input type="url" name="url" className="text-input w-full" defaultValue={props.entry.url} autoComplete="off"/>
                                </FormRow> 

                                <FormRow index={rowIndex++} label="User name">
                                    <input type="text" name="username" className="text-input w-full" defaultValue={props.entry.username} autoComplete="off" required/>
                                </FormRow>

                                <FormRow index={rowIndex++} label="Password">
                                    <PasswordField password={password} onChange={(newPassword) => setPassword(newPassword)} />
                                    <button type="button" className="btn" onClick={generatePassword}>Generate</button>
                                </FormRow> 
                            </div>
                        </Tab>
                        <Tab id="history" title="History">
                            <HistoryPanel historyItems={entry.history}/>
                        </Tab>
                    </Tabs>
                </form>

                {showPasswordGenerator && <PasswordGeneratorDialog onPasswordSelected={(password) => setPassword(password)} onClose={() => setShowPasswordGenerator(false)}/>}
            </div>
        </Modal>
    );
}

interface FormRowProps {
    index: number;
    label: string;
    children: any;
}

function FormRow(props: FormRowProps) {
    return (
        <div className={"py-1 md:px-4 md:py-5 grid grid-cols-4 gap-4" + alternatingClass(props.index, "bg-white", "bg-gray-100")}>
            <label className="">{props.label}</label>
            <div className="col-span-3">
                {props.children}
            </div>
        </div>
    );
}

interface HistoryPanelProps {
    historyItems: HistoryEntry[];
}

function HistoryPanel(props: HistoryPanelProps) {
    const [selectedEntry, setSelectedEntry] = React.useState<HistoryEntry>();

    return <div className="h-full flex flex-row">
        <ListView>
            {props.historyItems.map(historyItem => 
                <ListViewItem key={historyItem.id} selected={historyItem == selectedEntry} onClick={() => setSelectedEntry(historyItem)}>
                    <HistoryPanelEntry entry={historyItem}/>
                </ListViewItem>
            )}
        </ListView>

        <div className="flex-1 border md:p-2">
            {selectedEntry && <HistoryDetails entry={selectedEntry} />}
        </div>
    </div>;
}

interface HistoryPanelEntryProp {
    entry: HistoryEntry;
}

function HistoryPanelEntry(props: HistoryPanelEntryProp) {
    function FormatDateTime(date: Date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function pad(input: number, length: number = 2) {
        return "0".repeat(length - input.toString().length) + input;
    }

    return <>
        {FormatDateTime(props.entry.date)} 
        {props.entry.changes && <>
            <div className="text-sm">{props.entry.changes}</div>
        </>}
    </>;
}

interface HistoryDetailsProp {
    entry: HistoryEntry;
}

function HistoryDetails(props: HistoryDetailsProp) {
    return <dl>
        <HistoryDetailsEntry title="Name">
            <input type="text" value={props.entry.name} readOnly/>
        </HistoryDetailsEntry>

        <HistoryDetailsEntry title="User name">
            <input type="text" value={props.entry.username} readOnly/>
        </HistoryDetailsEntry>

        <HistoryDetailsEntry title="Password">
            <input type="password" value={props.entry.password} readOnly/>
        </HistoryDetailsEntry>
    </dl>
}

interface HistoryDetailsEntryProps {
    title: string;
    children: any;
}

function HistoryDetailsEntry(props: HistoryDetailsEntryProps) {
    return <>
        <dt className="text-gray-500">{props.title}</dt>
        <dd className="mb-2">{props.children}</dd>
    </>;
}