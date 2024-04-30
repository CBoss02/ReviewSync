import {useState} from "react"
import {useIdleTimer} from "react-idle-timer"
import {useAuth} from "../../contexts/AuthContext";

const useIdleTimeout = () => {
    const idleTimeout = 1000 * 60 * 10; //10 minutes
    const [isIdle, setIdle] = useState(false)
    const { logout } = useAuth();
    const handleIdle = () => {
        setIdle(true)
        logout()
    }
    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        onIdle: handleIdle
    })
    return {
        isIdle,
        setIdle,
        idleTimer
    }
}

export default useIdleTimeout;