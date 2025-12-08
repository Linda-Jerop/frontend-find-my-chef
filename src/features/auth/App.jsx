import { useState, useEffect, useCallback } from "react";
import {
    onAuthStateChanged,
    signInAnonymously,
    signInWithCustomToken,
    signOut
} from "firebase/auth";

import { auth } from "./firebase/firebase";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import Dashboard from "./components/dashboard/Dashboard";
import ImagePanel from "./components/ui/ImagePanel";
import MessageModal from "./components/ui/MessageModal";
import { Loader2 } from "lucide-react";

const App = () => {
    const [user, setUser] = useState(null);
    const [currentAuthView, setCurrentAuthView] = useState("login");
    const [authReady, setAuthReady] = useState(false);
    const [modalState, setModalState] = useState({ isOpen: false, title: "", body: "" });

    const initialAuthToken =
        typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

    const showModal = useCallback((title, body) => {
        setModalState({ isOpen: true, title, body });
    }, []);

    const closeModal = () => setModalState({ ...modalState, isOpen: false });

    const handleLogout = async () => {
        try {
            await signOut(auth);
            showModal("Signed Out", "You have successfully logged out.");
        } catch {
            showModal("Error", "Logout failed.");
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setAuthReady(true);
        });

        const initialSignIn = async () => {
            try {
                if (initialAuthToken)
                    await signInWithCustomToken(auth, initialAuthToken);
                else
                    await signInAnonymously(auth);
            } catch (err) {
                console.error(err);
            }
        };

        initialSignIn();

        return () => unsub();
    }, [showModal]);

    if (!authReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex items-center text-xl text-amber-700 bg-white p-6 rounded-xl shadow-lg">
                    <Loader2 className="animate-spin mr-2" />
                    Preparing the Kitchen...
                </div>
            </div>
        );
    }

    const isAuthView = user === null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden max-w-6xl w-full">

                <div className="grid grid-cols-1 lg:grid-cols-7 h-full">

                    <div className={`p-8 flex flex-col justify-center ${isAuthView ? "lg:col-span-3" : "lg:col-span-7"}`}>
                        {isAuthView ? (
                            currentAuthView === "login" ? (
                                <LoginForm toggleView={setCurrentAuthView} onShowModal={showModal} authReady={authReady} />
                            ) : (
                                <RegisterForm toggleView={setCurrentAuthView} onShowModal={showModal} authReady={authReady} />
                            )
                        ) : (
                            <Dashboard user={user} onLogout={handleLogout} />
                        )}
                    </div>

                    {isAuthView && (
                        <div className="hidden lg:block lg:col-span-4">
                            <ImagePanel />
                        </div>
                    )}
                </div>
            </div>

            <MessageModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                body={modalState.body}
                onClose={closeModal}
            />
        </div>
    );
};

export default App;
