import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const token = localStorage.getItem('authToken');

        // Security check: If not logged in, kick them back to /login
        if (!token) {
            navigate('/');
            setShow(false)
        } else {
            setShow(true)
            setName(storedName || 'User');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear(); // Clear storage
        navigate('/login'); // Redirect to login page
    };

    return (
        <>
            {show ?
                (
                    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
                    <nav>
                <Link to="/">Home</Link>
                <Link
                    to="/login"
                    onClick={handleLogout}

                >
                    Logout
                </Link>
                <h1>🎉 Hi, {name}!</h1>
            </nav>
            <h1>Welcome to BAAOB :)</h1>

                    </div>)

                :
                    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
                        <nav>
                <Link to="/">Home</Link>
                <Link
                to="/login"
                onClick={handleLogout}

        >
            Login
        </Link>
</nav>
                       <h1>Welcome to BAAOB :)</h1>
                    </div>
            }
      </>
    );
}