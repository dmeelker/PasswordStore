import React from 'react';
import { login, getPasswords, Entry } from '../../Services/ApiService';
import EntryService from '../../Model/EntryService';

export interface LoginProps {
    loginSuccessful: () => any;
}

export function Login(props: LoginProps) {
    const [loading, setLoading] = React.useState(false);
    const [username, setUsername] = React.useState("Dennis");
    const [password, setPassword] = React.useState("pass");
    const [errorMessage, setErrorMessage] = React.useState<string>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        login(username, password).then((success) => {
            getPasswords().then((document) => {
                if (document !== null) {
                    EntryService.load(document);
                } else {
                    EntryService.new(username);
                }
                props.loginSuccessful();
            });
        }, () => {
            setErrorMessage("Invalid login information");
            setLoading(false);
        });
    };

    function renderLoginButton() {
        if (loading) {
            return <button type="submit" className="btn btn-primary w-full rounded-full mx-0" disabled>Logging in</button>;
        } else {
            return <button type="submit" className="btn btn-primary w-full rounded-full mx-0">Log in</button>;
        }
    }

    function renderErrorMesage() {
        if (errorMessage) {
            return <div>{errorMessage}</div>
        } else {
            return <></>
        }
    }

    return (
        <div className="h-full flex">
        <div className="bg-white shadow p-4 m-auto px-20 py-16" style={{width: 500}}>
            <form onSubmit={handleSubmit}>
                {renderErrorMesage()}
                <div className="text-l leading-10 ">
                    <input type="text" disabled={loading} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="User name" className="block w-full border border-gray-500 rounded-t-lg px-2 focus:outline-none text-center box-border" required />
                    <input type="password" disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block w-full border border-t-0 border-gray-500 rounded-b-lg px-2 focus:outline-none text-center box-border" required />
                </div>
                <div className="text-center mt-4 mx-0 box-border">
                    {renderLoginButton()}
                </div>
            </form>
        </div>
        </div>
    );
}
