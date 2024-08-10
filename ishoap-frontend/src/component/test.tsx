import { useEffect } from "react"
import { useCookies } from "react-cookie";

export const Test = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    var token = cookies['token']


    useEffect(() => {
        setTimeout(() => {
       
       
            console.log('token in use effect', token)
        }, 2000)

    }, []);


    return (
        <>
            <h1> i am test file </h1>
        </>
    )
}