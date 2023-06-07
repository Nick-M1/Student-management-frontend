import {LOGO_PNG} from "../constants/assets-constants";
import {FormEvent} from "react";
import {updateJwtToken} from "../utils/authentication";
import {useNavigate} from "react-router-dom";
import signIn from "../DB/authentication/signIn";


export default function SigninPage() {
    const navigate = useNavigate()

    const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const email: string = e.currentTarget.email.value
        const password: string = e.currentTarget.password.value

        const response = await signIn(email, password)

        if (!response.ok) {
            console.log(response)
            return
        }

        const { jwtToken, role, id }: { jwtToken: string, role: string, id: string } = await response.json()
        updateJwtToken(jwtToken, role, id)

        navigate('/')
    }


    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="flex items-center mb-6 text-3xl font-semibold text-gray-900">
                    <img className="w-20 h-20 mr-3" src={LOGO_PNG} alt="logo"/>
                        Student Management
                </div>
                <div
                    className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={onSignIn}>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900">Your
                                    email</label>
                                <input type="email" name="email" id="email"
                                       className="bg-gray-50 w-full input-primary"
                                       placeholder="name@company.com" required={true}/>
                            </div>
                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                       className="bg-gray-50 w-full input-primary"
                                       required={true}/>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start cursor-pointer">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox"
                                               className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300  cursor-pointer"
                                               required={false}/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500  cursor-pointer">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</a>
                            </div>
                            <button type="submit" className="w-full btn-primary"> Sign in </button>
                            <p className="text-sm font-light text-gray-500">
                                Don’t have an account yet? <a href="#" className="font-medium text-blue-600 hover:underline smooth-transition">Sign up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}