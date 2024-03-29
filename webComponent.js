class Fetch extends HTMLElement {
    constructor() {
        super();
        this.element;
        this.pagination = 1;
        this.maxPagination;
        this.perPage = 20;
        this.key;
    }

    static get observedAttributes() {
        return ['element', 'pagination', 'perPage', 'key', 'maxPagination'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'element':
                this.element = newValue;
                break;
            case 'pagination':
                this.pagination = newValue;
                break;
            case 'perPage':
                this.perPage = newValue;
                break;
            case 'key':
                this.key = newValue;
                break;
            case 'maxPagination':
                this.maxPagination = newValue;
                break;
        }
    }
    
    async connectedCallback() {
        this.updateData();
    }

    async fetchData() {
        const response = await fetch(`https://narutodb.xyz/api/${this.element}?page=${this.pagination}&limit=${this.perPage}`);
        const data = await response.json();
        return data;
    }

    async updateData() {
        const data = await this.fetchData();
        const maxAttr = "total"+this.element.charAt(0).toUpperCase()+this.element.slice(1)+"s";
        const division = data[maxAttr] / this.perPage;
        const fixDivision = data[maxAttr] % this.perPage === 0 ? division : Math.ceil(division);
        this.maxPagination = fixDivision;

        this.innerHTML = `<section class="block container mx-auto p-6 font-sans ">
                            <h3 class="text-3xl font-bold text-gray-900 text-center mb-3">List of ${this.element}s</h3>
                            ${this.printAllData(data)}
                            <div class="flex justify-center gap-2 mt-4">
                                <button id="previous" class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed" ${this.pagination == 1 ? "disabled" : ""}>Previous</button>
                                <button id="current" class="bg-white  text-black font-bold py-2 px-4 rounded disabled:opacity-50 " disabled>Page ${this.pagination} of ${this.maxPagination}</button>
                                <button id="next" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed" ${this.pagination == this.maxPagination ? "disabled" : ""}>Next</button>
                                </div>
                        </section>`;
                        
        const nextButton = this.querySelector("#next");
        const previousButton = this.querySelector("#previous");

        // Asignar eventos a los botones
        nextButton.addEventListener("click", () => this.handlingPagination(true));
        previousButton.addEventListener("click", () => this.handlingPagination(false));
    }


    printAllData(data) {
        let html = '<div class="flex flex-wrap gap-4 justify-center align-center ">';
        data[this.element+'s'].forEach(element => {
            html += '<div class="bg-gray-800 border border-gray-800 text-gray-200 rounded-lg shadow  w-[250px]">';
            const imageHandler = !element.images ? "" : Object.keys(element?.images).length > 0 ? element?.images[0] : "https://placekitten.com/300/200";

            const img = new Image();
            img.src = imageHandler;
            console.log(img.height);

            const imgProperties = img.width < 200 ? "object-contain" : "object-cover";
            html += !element.images ? "" : `<a href="#" class="">
                                                <img class="rounded-t-lg w-full h-[150px] ${imgProperties} aspect-w-16 aspect-h-9" src="${imageHandler}" alt="${element.name}">
                                            </a>`;
            html += `<div class="p-5">`;
            for (let key in element) {
                switch (key) {
                    case 'name':
                        html += `<a href="#">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        ${element[key]}
                                    </h5>
                                </a>`;
                        break;
                    case 'jutsu':
                        html += `<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    ${element[key][0]}
                                </p>`;
                        break;
                }
            }
            html += `<a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Read more
                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </a>`;
            html += `</div></div>`;
        });
        return html + '</div>';
    }

    handlingPagination(boolean) {    
        if (boolean) {
            if (this.pagination < this.maxPagination) {
                this.pagination++;
                this.updateData();
            }
        } else {
            if (this.pagination > 1) {
                this.pagination--;
                this.updateData();
            }
        }
    }

}

customElements.define("fetch-component", Fetch);
