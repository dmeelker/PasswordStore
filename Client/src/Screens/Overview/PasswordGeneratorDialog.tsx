import { Modal } from "../../Components/Modal";
import React, { useState, useEffect } from "react";
import { generateRandomPassword, generateRandomWords } from "../../Services/PasswordGenerator";
import { PasswordField } from "../../Components/PasswordField";

enum Mode {
    RandomCharacters,
    RandomWords
}

interface PasswordGeneratorDialogProps {
    onPasswordSelected: (password: string) => void;
    onClose: () => void;
}

export function PasswordGeneratorDialog(props: PasswordGeneratorDialogProps) {
    const [minLength, setMinLength] = useState(32);
    const [mode, setMode] = useState(Mode.RandomCharacters);
    const [password, setPassword] = useState("");
    const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(true);
    
    function generatePassword(mode: Mode) {
        var password = "";

        if(mode == Mode.RandomCharacters) {
            password = generateRandomPassword({minLength, includeSpecialCharacters});
        } else if(mode == Mode.RandomWords) {
            password = generateRandomWords(minLength);
        }
        
        setPassword(password);
    }

    function switchMode(newMode: Mode) {
        setMode(newMode);
        generatePassword(newMode);
    }

    function okClicked() {
        props.onPasswordSelected(password);
        close();
    }

    function close() {
        props.onClose();
    }

    function modeSelector(label: string, selectMode: Mode) {
        return <label>
            <input type="radio" name="passwordType" className="mr-1" checked={mode == selectMode} onClick={() => switchMode(selectMode)}/>
            {label}
        </label>;
    }

    useEffect(() => generatePassword(mode), []);

    return <Modal 
        title="Generate Password"
        buttonBar={<>
            <button type="submit" className="btn-primary" onClick={okClicked}>Ok</button>
            <button type="button" className="btn-secondary" onClick={close}>Cancel</button>
        </>}>
        <div className="flex flex-col" style={{maxWidth: 500, width: "100vw"}}>
            <div className="flex-1">
                <div>
                    Min. length: <input type="number" className="text-input" value={minLength} onChange={(e) => setMinLength(parseInt(e.target.value))} style={{width: "4rem"}}/>
                </div>

                <div className="mt-2">
                    <fieldset>
                        <legend>
                            {modeSelector("Random characters", Mode.RandomCharacters)}
                        </legend>
                        <div>
                            <label><input type="checkbox" checked={includeSpecialCharacters} onChange={(e) => {setIncludeSpecialCharacters(e.target.checked)}}></input>Include special characters</label>
                        </div>
                    </fieldset>

                    {modeSelector("Random words", Mode.RandomWords)}
                </div>

                <div className="grid mt-2" style={{gap: ".3rem", gridTemplateColumns: "auto 1fr"}}>
                    <span style={{gridRow: 1, gridColumn: 1, alignSelf: "center"}}>Password:</span>
                    <div style={{gridRow: 1, gridColumn: 2}}>
                        <PasswordField password={password} readonly/>
                    </div>
                    
                    <button type="button" className="btn text-sm" onClick={() => generatePassword(mode)} style={{gridRow: 2, gridColumn: 2, justifySelf: "end"}}>Generate</button>
                </div>
            </div>
        </div>
      </Modal>
}