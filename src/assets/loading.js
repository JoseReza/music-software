
const loading = {
    main: {
        show: async () => {
            document.getElementById("divLoadingMain").style.display = "block";
            document.body.style.overflow = "hidden";
        },
        hide: async () => {
            document.getElementById("divLoadingMain").style.display = "none";
            document.body.style.overflow = "auto";
        }
    },
    secondary: {
        show: async () => {
            document.getElementById("divLoadingSecondary").style.display = "block";
            document.body.style.overflow = "hidden";
        },
        hide: async () => {
            document.getElementById("divLoadingSecondary").style.display = "none";
            document.body.style.overflow = "auto";
        }
    },
    generatingMain: {
        show: async () => {
            document.getElementById("divLoadingMain").style.display = "block";
            document.body.style.overflow = "hidden";
        },
        update: async (progress) => {
            document.getElementById("divAdviceMain").innerHTML = `
                <div>Generating and exporting file</div>
                <div>${progress}%</div>
            `;
        },
        hide: async () => {
            document.getElementById("divLoadingMain").style.display = "none";
            document.body.style.overflow = "auto";
            document.getElementById("divAdviceMain").innerHTML = ``;
        }
    },
    generatingSecondary: {
        show: async () => {
            document.getElementById("divLoadingSecondary").style.display = "block";
            document.body.style.overflow = "hidden";
        },
        update: async (message) => {
            document.getElementById("divAdviceSecondary").innerHTML = message;
        },
        hide: async () => {
            document.getElementById("divLoadingSecondary").style.display = "none";
            document.body.style.overflow = "auto";
            document.getElementById("divAdviceSecondary").innerHTML = ``;
        }
    }
}