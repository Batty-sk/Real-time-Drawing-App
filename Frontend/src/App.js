import Parent from "./Components/Parent"
const App=()=>{

    return(
        <>
        <div className="mb-5 mt-5 text-center mono">
        <h1 id="heading" className="d-inline-block"><span id="drawing">Drawing</span> 
        <span id="master"> Master </span> </h1>
        </div>
        <Parent></Parent>

        <footer class="footer mono">
            <div class="container text-center">
            <p>Made By Saurav Kumar.</p>
            <ul>
                <li>
                   <div><i class='bx bxl-github bx-md' ></i></div>  <a href="https://github.com/Batty-sk">Github</a></li>
                <li>
                    <div>
                    <i class='bx bxs-envelope bx-md' ></i> 
                    </div>
                <a href="#">Saorav.skumar@gmail.com</a></li>
            </ul>
            </div>
        </footer>
        </>
    )
}
export default App