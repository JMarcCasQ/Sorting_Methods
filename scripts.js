$(document).ready(function () {
    let array = [];
    let delay = 100;
    let isSorting = false;
    let currentAlgorithm = 'bubble';
    let currentVisualization = 'bars';

    // Initialize array
    generateArray();

    // Start to listen for events handled
    $("#algorithm").change(function () {
        currentAlgorithm = $(this).val();
        updateInfo();
    });

    $("#visualization").change(function () {
        currentVisualization = $(this).val();
        generateArray();
    });

    $("#generate").click(function () {
        if (!isSorting) generateArray();
    });

    $("#sort").click(function () {
        if (!isSorting) {
            switch (currentAlgorithm) {
                case 'bubble': bubbleSort(); break;
                case 'selection': selectionSort(); break;
                case 'insertion': insertionSort(); break;
            }
        }
    });

    $("#speed").change(function () {
        delay = 210 - $(this).val();
    });

    // Function to generate random array
    function generateArray() {
        array = [];
        $(".visualization").empty();
        const count = currentVisualization === 'bars' ? 15 : 8;

        for (let i = 0; i < count; i++) {
            array.push(Math.floor(Math.random() * 90) + 10);

            if (currentVisualization === 'bars') {
                $(".visualization").append(`
                            <div class="bar-container">
                                <div class="bar" data-index="${i}" style="height:${array[i]}px">
                                    <div class="bar-value">${array[i]}</div>
                                </div>
                            </div>
                        `);
            } else {
                $(".visualization").append(`
                            <div class="circle-container">
                                <div class="circle" data-index="${i}">${array[i]}</div>
                            </div>
                        `);
            }
        }
        updateInfo();
    }

    // Updating algorithm info (displayed)
    function updateInfo() {
        let info = "";
        switch (currentAlgorithm) {
            case 'bubble':
                info = "<strong>Bubble Sort</strong>";
                break;
            case 'selection':
                info = "<strong>Selection Sort</strong>";
                break;
            case 'insertion':
                info = "<strong>Insertion Sort</strong>";
                break;
        }
        $("#info").html(info);
    }

    // Start of Algorithms 

    async function bubbleSort() {
        isSorting = true;
        let len = array.length;

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                highlightElements(j, j + 1, 'comparing');
                await sleep(delay);

                if (array[j] > array[j + 1]) {
                    swapElements(j, j + 1);
                    highlightElements(j, j + 1, 'swapped');
                    await sleep(delay);
                }

                resetHighlights();
            }
            if (currentAlgorithm === 'bubble') markSorted(len - i - 1);
        }
        isSorting = false;
        markAllSorted();
    }

    async function selectionSort() {
        isSorting = true;
        let len = array.length;

        for (let i = 0; i < len; i++) {
            let minIdx = i;
            highlightElement(minIdx, 'comparing');
            await sleep(delay);

            for (let j = i + 1; j < len; j++) {
                highlightElement(j, 'comparing');
                await sleep(delay / 2);

                if (array[j] < array[minIdx]) {
                    resetElement(minIdx);
                    minIdx = j;
                    highlightElement(minIdx, 'comparing');
                    await sleep(delay / 2);
                }

                resetElement(j);
            }

            if (minIdx !== i) {
                swapElements(i, minIdx);
                highlightElements(i, minIdx, 'swapped');
                await sleep(delay);
            }

            markSorted(i);
        }
        isSorting = false;
        markAllSorted();
    }

    async function insertionSort() {
        isSorting = true;
        let len = array.length;

        markSorted(0);

        for (let i = 1; i < len; i++) {
            let key = array[i];
            let j = i - 1;

            highlightElement(i, 'key');
            await sleep(delay);

            while (j >= 0 && array[j] > key) {
                highlightElement(j, 'comparing');
                await sleep(delay);

                array[j + 1] = array[j];
                updateElement(j + 1, array[j + 1]);
                resetElement(j);
                highlightElement(j + 1, 'swapped');
                await sleep(delay);
                resetElement(j + 1);

                j--;
            }

            array[j + 1] = key;
            updateElement(j + 1, key);
            resetElement(i);
            markSorted(j + 1);
            await sleep(delay);
        }
        isSorting = false;
        markAllSorted();
    }

    // Visualizations on display, shown on the display 

    function highlightElement(index, className) {
        $(`[data-index="${index}"]`).addClass(className);
    }

    function highlightElements(index1, index2, className) {
        $(`[data-index="${index1}"], [data-index="${index2}"]`).addClass(className);
    }

    function resetElement(index) {
        $(`[data-index="${index}"]`).removeClass("comparing swapped key");
    }

    function resetHighlights() {
        $(".bar, .circle").removeClass("comparing swapped key");
    }

    function markSorted(index) {
        $(`[data-index="${index}"]`).addClass("sorted");
    }

    function markAllSorted() {
        $(".bar, .circle").addClass("sorted").removeClass("comparing swapped key");
    }

    function swapElements(index1, index2) {
        [array[index1], array[index2]] = [array[index2], array[index1]];
        updateElement(index1, array[index1]);
        updateElement(index2, array[index2]);
    }

    function updateElement(index, value) {
        const element = $(`[data-index="${index}"]`);
        if (currentVisualization === 'bars') {
            element.css("height", value + "px")
                .find(".bar-value").text(value);
        } else {
            element.text(value);
        }
    }

    // Promise to use on the timeout 
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});