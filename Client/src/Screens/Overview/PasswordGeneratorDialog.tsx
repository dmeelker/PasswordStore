import { Modal } from "../../Components/Modal";
import React, { useState } from "react";
import { FieldSet } from "../../Components/FieldSet";
import { FaEye } from "react-icons/fa";
import { generateRandomPassword, generateRandomWords } from "../../Services/PasswordGenerator";

enum Mode {
    RandomCharacters,
    RandomWords
}

interface PasswordGeneratorDialogProps {

}

export function PasswordGeneratorDialog(props: PasswordGeneratorDialogProps) {
    const [minLength, setMinLength] = useState(32);
    const [mode, setMode] = useState(Mode.RandomCharacters);
    const [password, setPassword] = useState("");
    
    function generatePassword() {
        var password = "";

        if(mode == Mode.RandomCharacters) {
            password = generateRandomPassword({minLength});
        } else if(mode == Mode.RandomWords) {
            password = generateRandomWords(minLength);
        }
        
        setPassword(password);
    }

    return <Modal title="Generate Password">
        <div className="flex flex-col">
            <div className="flex-1">
                <div>
                    Min. length: <input type="number" className="text-input" value={minLength} onChange={(e) => setMinLength(parseInt(e.target.value))} style={{width: "4rem"}}/>
                </div>

                <fieldset>
                    <legend>
                        <label>
                            <input type="radio" name="passwordType" className="mr-1" checked={mode == Mode.RandomCharacters} onClick={() => setMode(Mode.RandomCharacters)}/>
                            Random characters
                        </label>
                    </legend>
                    <div>
                        X
                    </div>
                </fieldset>

                <label>
                    <input type="radio" name="passwordType" className="mr-1" checked={mode == Mode.RandomWords} onClick={() => setMode(Mode.RandomWords)}/>
                    Random words
                </label>

                <div>
                    Password: <input type="text" className="text-input" value={password}/>
                    <button type="button" className="btn"><FaEye/></button>
                </div>
                <div className="text-right m-4">
                    <button type="button" className="btn-primary text-sm" onClick={generatePassword}>Generate</button>
                </div>
            </div>
            <div className="text-right m-4">
                <button type="submit" className="btn-primary">Ok</button>
                <button type="button" className="btn-secondary">Cancel</button>
            </div>
        </div>
      </Modal>
}