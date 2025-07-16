import { Link } from "react-router-dom";
import { theme } from "../theme";

const AuthPage = () => {
    return (
        <div className={`min-h-screen flex items-center justify-center ${theme.bg.page} text-accent dark:text-white px-4`}>
            <div className={`w-full max-w-2xl space-y-8 p-10 ${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} border border-gray-200 dark:border-zinc-700`}>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">Welcome to SupportMe</h1>
                    <p className="text-sm mt-2 text-muted">
                        Sign in or create an account to get started.
                    </p>
                </div>

                <div className="flex flex-col space-y-4">
                    <Link
                        to="/signin"
                        className="w-full py-2 px-4 bg-white text-gray-800 text-center font-medium text-sm rounded-md hover:bg-gray-100 transition dark:bg-zinc-200"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="w-full py-2 px-4 bg-primary text-white text-center font-medium text-sm rounded-md hover:bg-blue-700 transition"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

