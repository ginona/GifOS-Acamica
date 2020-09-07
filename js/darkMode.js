document.documentElement.setAttribute('color-mode','light');
function darkMode(){
    const changeColorMode = e =>{
        if(e.currentTarget.classList.contains("hideL")){
            document.documentElement.setAttribute("color-mode", "light");
            return;
        }
            document.documentElement.setAttribute("color-mode", "dark");
    };
    const changeColorBtn = document.querySelectorAll(".change-btn");

    changeColorBtn.forEach( btn => { btn.addEventListener("click", changeColorMode) })
};

darkMode();