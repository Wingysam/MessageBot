type alertQueueItem = {
    html: string,
    buttons?: Array<{ text: string, style?: string } | string>,
    callback?: (s: string) => void,
};

/**
 * Holds the current alert and queue of further alerts.
 */
const modal = document.querySelector('#alert') as HTMLElement;
const modalBody = modal.querySelector('.modal-card-body') as HTMLElement;
const modalFooter = modal.querySelector('.modal-card-foot') as HTMLElement;
const instance: {active: boolean, queue: alertQueueItem[], current?: alertQueueItem} = {
    active: false,
    queue: [] as alertQueueItem[],
};

modalFooter.addEventListener('click', event => {
    let target = event.target as HTMLAnchorElement;
    if (!target || target.tagName != 'A') {
        return;
    }

    if (instance.current && instance.current.callback) {
        // Text is a special property of anchor elements that always contains the text, textContent can be null.
        try {
            instance.current.callback(target.text);
        } catch(e) {
            console.error("Error running button handler: ", e);
        }
    }

    modal.classList.remove('is-active');
    modalFooter.innerHTML = '';
    instance.active = false;

    // Are more alerts waiting to be shown?
    let next = instance.queue.shift();
    if (next) {
        alert(next.html, next.buttons, next.callback);
    }
});

function addButton(button: {text: string, style?: string} | string) {
    if (typeof button == 'string') {
        addButton({text: button});
        return;
    }

    var el = document.createElement('a');
    el.innerHTML = button.text;

    el.classList.add('button');
    if (button.style) {
        el.classList.add(button.style);
    }

    modalFooter.appendChild(el);
}

/** @hidden */
export function alert(html: string, buttons?: Array<{ text: string, style?: string } | string>, callback?: (text: string) => void): void {
    if (instance.active) {
        instance.queue.push({html, buttons, callback});
        return;
    }
    instance.active = true;
    instance.current = {html, buttons, callback};

    modalBody.innerHTML = html;

    if (Array.isArray(buttons)) {
        buttons.forEach(addButton);
    } else {
        addButton('OK');
    }

    modal.classList.add('is-active');
}

export function prompt(text: string, callback?: (response: string) => void): void {
    let p = document.createElement('p');
    p.textContent = text;
    alert(p.outerHTML + '<textarea class="textarea"></textarea>', ['OK', 'Cancel'], () => {
        let textarea = document.querySelector('#alert textarea') as HTMLTextAreaElement;
        if (callback) callback(textarea.textContent || '');
    });
}
