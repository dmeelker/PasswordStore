import React, { useEffect } from 'react';
import { PasswordEntry, HistoryEntry } from '../../Model/Model';
import { GeneratePassword } from '../../Services/PasswordGenerator';
import { alternatingClass, conditionalClass } from '../../Utilities/RenderHelpers';
import { FaEye } from 'react-icons/fa';
import { Tabs, Tab } from '../../Components/Tabs';

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
                    <Tab id="stuff" title="Stuff!">
                        Stuff
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
        <div className="border overflow-y-auto h-full mr-2" style={{minWidth: "12rem"}}>
            {props.historyItems.length == 0 && "None"}
            {props.historyItems.map(historyItem => 
                <HistoryPanelEntry entry={historyItem} selected={historyItem == selectedEntry} onClick={() => setSelectedEntry(historyItem)}/>
            )}
        </div>
        <div className="flex-1 border md:p-2">
            {selectedEntry && <HistoryDetails entry={selectedEntry} />}
        </div>
    </div>;
}

interface HistoryPanelEntryProp {
    entry: HistoryEntry;
    selected: boolean;
    onClick: (entry: HistoryEntry) => void;
}

function HistoryPanelEntry(props: HistoryPanelEntryProp) {
    function FormatDateTime(date: Date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function pad(input: number, length: number = 2) {
        let str: string = input.toString();

        while (str.length < length) {
            str = "0" + str;
        }

        return str;
    }

    function onClick(event: React.MouseEvent) {
        props.onClick(props.entry);
        event.preventDefault();
    }

    return <button onClick={onClick} className={"block px-2 md:leading-7 w-full text-left" + conditionalClass(props.selected, "bg-green-300")}>
        {FormatDateTime(props.entry.date)}
    </button>
}

interface HistoryDetailsProp {
    entry: HistoryEntry;
}

function HistoryDetails(props: HistoryDetailsProp) {
    return <dl>
        <dt>Name</dt>
        <dd><input type="text" value={props.entry.name}/></dd>

        <dt>User name</dt>
        <dd><input type="text" value={props.entry.username}/></dd>

        <dt>Password</dt>
        <dd><input type="password" value={props.entry.password}/></dd>
    </dl>
}