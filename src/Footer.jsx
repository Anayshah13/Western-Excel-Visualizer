function Footer(){
    return(
        <footer>
            <div className="footer">&copy; {new Date().toLocaleDateString()} Anay's Western Database</div>
        </footer>
    );
}

export default Footer