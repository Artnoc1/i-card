import tag from 'html-tag-js';
import autosize from 'autosize';
import tile from "./tile";

/**
 * 
 * @param {string} message 
 * @param {string} defaultValue 
 * @param {"text"|"numberic"|"tel"|"search"|"email", "url"} type 
 * @param {object} options
 * @param {RegExp} options.match
 * @param {boolean} options.required
 */
function prompt(message, defaultValue, type = 'text', options = {}) {
    return new Promise((resolve) => {

        const inputType = type === 'text' ? 'textarea' : 'input';
        type = type === 'filename' ? 'text' : type;

        const messageSpan = tag('span', {
            textContent: message,
            className: 'message'
        });
        const input = tag(inputType, {
            value: defaultValue,
            className: 'input',
        });
        const okBtn = tag('button', {
            type: "submit",
            textContent: 'ok',
            disabled: !defaultValue,
            onclick: function () {
                if (options.required && !input.value) {
                    errorMessage.textContent = 'This feild is required!';
                    return;
                }
                hide();
                resolve(input.value);
            }
        });
        const cancelBtn = tag('button', {
            textContent: 'cancel',
            type: 'button',
            onclick: function () {
                hide();
            }
        });
        const errorMessage = tag("span", {
            className: 'error-msg'
        });
        const promptDiv = tag('form', {
            action: "#",
            className: 'prompt',
            onsubmit: (e) => {
                e.preventDefault();
                if (!okBtn.disabled) {
                    resolve(input.value);
                }
            },
            children: [
                messageSpan,
                input,
                errorMessage,
                tag('div', {
                    className: 'button-container',
                    children: [
                        cancelBtn,
                        okBtn
                    ]
                })
            ]
        });
        const mask = tag('span', {
            className: 'mask'
        });

        if (inputType === 'textarea') {
            input.rows = 1;
            input.inputMode = type;
        } else {
            input.type = type;
        }

        input.oninput = function () {
            if (options.match && !options.match.test(this.value)) {
                okBtn.disabled = true;
                errorMessage.textContent = 'Not a valid input';
            } else {
                okBtn.disabled = false;
                errorMessage.textContent = '';
            }
        };

        input.onfocus = function () {
            this.select();
        };

        document.body.append(promptDiv, mask);
        input.focus();
        autosize(input);

        function hidePrompt() {
            promptDiv.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(promptDiv);
                document.body.removeChild(mask);
            }, 300);
        }

        function hide() {
            hidePrompt();
        }
    });
}

/**
 * 
 * @param {string} titleText 
 * @param {string} message 
 */
function alert(titleText, message) {

    if (!message && titleText) {
        message = titleText;
        titleText = '';
    }

    const regex = /(https?:\/\/)?((www[^\.]?)\.)?([\w\d]+)\.([a-zA-Z]{2,8})(\/[^ ]*)?/;
    if (regex.test(message)) {
        const exec = regex.exec(message);
        message = message.replace(exec[0], `<a href='${exec[0]}'>${exec[0]}</a>`);
    }

    const titleSpan = tag('strong', {
        className: 'title',
        textContent: titleText
    });
    const messageSpan = tag('span', {
        className: 'message',
        innerHTML: message
    });
    const okBtn = tag('button', {
        textContent: 'ok',
        onclick: function () {
            hide();
        }
    });
    const alertDiv = tag('div', {
        className: 'prompt alert',
        children: [
            titleSpan,
            messageSpan,
            tag('div', {
                className: 'button-container',
                child: okBtn
            })
        ]
    });
    const mask = tag('span', {
        className: 'mask'
    });

    document.body.append(alertDiv, mask);

    function hideAlert() {
        alertDiv.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
            document.body.removeChild(mask);
        }, 300);
    }

    function hide() {
        hideAlert();
    }
}

function confirm(titleText, message) {
    return new Promise((resolve) => {
        if (!message && titleText) {
            message = titleText;
            titleText = '';
        }

        const titleSpan = tag('strong', {
            className: 'title',
            textContent: titleText
        });
        const messageSpan = tag('span', {
            className: 'message',
            textContent: message
        });
        const okBtn = tag('button', {
            textContent: 'ok',
            onclick: function () {
                hide();
                resolve();
            }
        });
        const cancelBtn = tag('button', {
            textContent: 'cancel',
            onclick: function () {
                hide();
            }
        });
        const confirmDiv = tag('div', {
            className: 'prompt confirm',
            children: [
                titleSpan,
                messageSpan,
                tag('div', {
                    className: 'button-container',
                    children: [
                        cancelBtn,
                        okBtn
                    ]
                })
            ]
        });
        const mask = tag('span', {
            className: 'mask'
        });

        document.body.append(confirmDiv, mask);

        function hideAlert() {
            confirmDiv.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(confirmDiv);
                document.body.removeChild(mask);
            }, 300);
        }

        function hide() {
            hideAlert();
        }
    });
}

/**
 * 
 * @param {string} title 
 * @param {string[]} options 
 * @param {object} opts 
 * @param {string} opts.default 
 */
function select(title, options, opts = {}) {
    return new Promise(resolve => {
        const titleSpan = title && tag('strong', {
            className: 'title',
            textContent: title
        });
        const list = tag('ul');
        const selectDiv = tag('div', {
            className: 'prompt select',
            children: titleSpan ? [
                titleSpan,
                list
            ] : [list]
        });
        const mask = tag('span', {
            className: 'mask',
            onclick: hide
        });

        options.map(option => {

            let value = null;
            let text = null;
            let lead = null;
            if (Array.isArray(option)) {
                value = option[0];
                text = option[1];

                if (option.length > 2) {
                    lead = tag('i', {
                        className: `icon ${option[2]}`
                    });
                }
            } else {
                value = text = option;
            }

            const item = tile({
                lead,
                text
            });

            if (opts.default === value) {
                item.classList.add('selected');
                setTimeout(function () {
                    item.scrollIntoView();
                }, 10);
            }

            item.onclick = function () {
                resolve(value);
                hide();
            };

            list.append(item);
        });

        document.body.append(selectDiv, mask);


        function hideSelect() {
            selectDiv.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(selectDiv);
                document.body.removeChild(mask);
            }, 300);
        }

        function hide() {
            hideSelect();
        }
    });
}

function iBox(title, content) {
    return new Promise(resolve => {
        const titleSpan = tag('strong', {
            className: 'title',
            textContent: title
        });
        const body = tag('div', {
            innerHTML: content
        });
        const boxDiv = tag('div', {
            className: 'prompt',
            children: [
                titleSpan,
                body
            ]
        });
        const mask = tag('span', {
            className: 'mask',
            onclick: hide
        });

        body.onclick = function (e) {
            const target = e.target;
            hide();
            resolve(target);
        }

        document.body.append(boxDiv, mask);

        function hideSelect() {
            boxDiv.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(boxDiv);
                document.body.removeChild(mask);
            }, 300);
        }

        function hide() {
            hideSelect();
        }
    });
}

export default {
    prompt,
    alert,
    confirm,
    select,
    iBox
};