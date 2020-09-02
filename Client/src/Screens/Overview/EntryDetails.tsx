import React, { useEffect } from 'react';
import { PasswordEntry, HistoryEntry } from '../../Model/Model';
import { GeneratePassword } from '../../Services/PasswordGenerator';
import { alternatingClass, conditionalClass } from '../../Utilities/RenderHelpers';
import { FaEye } from 'react-icons/fa';
import { Tabs, Tab } from '../../Components/Tabs';
import { ListView, ListViewItem } from '../../Components/ListView';
import { stringify } from 'querystring';

interface EntryDetailsProp {
    entry: PasswordEntry;
    savePressed: () => any;
    cancelPressed: () => any;
}

export function EntryDetails(props: EntryDetailsProp) {
    const entry = props.entry;
    const [showPassword, setShowPassword] = React.useState(false);
    const [password, setPassword] = React.useState(entry.password);
    const firstField = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        firstField.current?.focus();
    }, []);

    function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData(event.target as HTMLFormElement);
        entry.name = formData.get("name") as string;
        entry.url = formData.get("url") as string;
        entry.username = formData.get("username") as string;
        entry.password = formData.get("password") as string;
        props.savePressed();
    };

    function cancelButtonPressed(event: React.MouseEvent) {
        props.cancelPressed();
        event.preventDefault();
    };

    function togglePasswordShown(event: React.MouseEvent) {
        setShowPassword(!showPassword);
        event.preventDefault();
    };

    function generatePassword(event: React.MouseEvent) {
        const password = GeneratePassword({minLength: 32});
        setPassword(password);
        event.preventDefault();
    };

    let rowIndex = 0;

    return (
        <div style={{maxWidth: 600, width: "100vw"}}>
            <form onSubmit={onFormSubmit}>
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
                                <input type={showPassword ? "text": "password"} name="password" className="text-input w-full" value={password} onChange={(event)=>{ setPassword(event.target.value)}} required/>
                                <button type="button" className="btn" onClick={togglePasswordShown}><FaEye/></button>
                                <button type="button" className="btn" onClick={generatePassword}>Generate</button>
                            </FormRow> 
                        </div>
                    </Tab>
                    <Tab id="history" title="History">
                        <HistoryPanel historyItems={entry.history}/>
                    </Tab>
                </Tabs>
                <div className="text-right m-4">
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" className="btn-secondary" onClick={cancelButtonPressed}>Cancel</button>
                </div>
            </form>
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
            <div className="text-sm">Changed {props.entry.changes}</div>
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