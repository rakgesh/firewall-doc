
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    // used internally for testing
    function set_now(fn) {
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.53.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.53.1 */

    const { Error: Error_1, Object: Object_1, console: console_1$8 } = globals;

    // (267:0) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(267:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:0) {#if componentParams}
    function create_if_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(260:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    function restoreScroll(state) {
    	// If this exists, then this is a back navigation: restore the scroll position
    	if (state) {
    		window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
    	} else {
    		// Otherwise this is a forward navigation: scroll to top
    		window.scrollTo(0, 0);
    	}
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			restoreScroll(previousScrollState);
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		restoreScroll,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Home.svelte generated by Svelte v3.53.1 */

    const file$9 = "src\\pages\\Home.svelte";

    function create_fragment$9(ctx) {
    	let h1;
    	let t1;
    	let h4;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Das isch blöd platziert";
    			t1 = space();
    			h4 = element("h4");
    			h4.textContent = "Host Object kann man testen";
    			add_location(h1, file$9, 0, 0, 0);
    			add_location(h4, file$9, 1, 0, 34);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h4, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    function bind(fn, thisArg) {
      return function wrap() {
        return fn.apply(thisArg, arguments);
      };
    }

    // utils is a library of generic helper functions non-specific to axios

    const {toString} = Object.prototype;
    const {getPrototypeOf} = Object;

    const kindOf = (cache => thing => {
        const str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(Object.create(null));

    const kindOfTest = (type) => {
      type = type.toLowerCase();
      return (thing) => kindOf(thing) === type
    };

    const typeOfTest = type => thing => typeof thing === type;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     *
     * @returns {boolean} True if value is an Array, otherwise false
     */
    const {isArray} = Array;

    /**
     * Determine if a value is undefined
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    const isUndefined = typeOfTest('undefined');

    /**
     * Determine if a value is a Buffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    const isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      let result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a String, otherwise false
     */
    const isString = typeOfTest('string');

    /**
     * Determine if a value is a Function
     *
     * @param {*} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    const isFunction = typeOfTest('function');

    /**
     * Determine if a value is a Number
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Number, otherwise false
     */
    const isNumber = typeOfTest('number');

    /**
     * Determine if a value is an Object
     *
     * @param {*} thing The value to test
     *
     * @returns {boolean} True if value is an Object, otherwise false
     */
    const isObject = (thing) => thing !== null && typeof thing === 'object';

    /**
     * Determine if a value is a Boolean
     *
     * @param {*} thing The value to test
     * @returns {boolean} True if value is a Boolean, otherwise false
     */
    const isBoolean = thing => thing === true || thing === false;

    /**
     * Determine if a value is a plain Object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a plain Object, otherwise false
     */
    const isPlainObject = (val) => {
      if (kindOf(val) !== 'object') {
        return false;
      }

      const prototype = getPrototypeOf(val);
      return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
    };

    /**
     * Determine if a value is a Date
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Date, otherwise false
     */
    const isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a File, otherwise false
     */
    const isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    const isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a File, otherwise false
     */
    const isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Stream
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    const isStream = (val) => isObject(val) && isFunction(val.pipe);

    /**
     * Determine if a value is a FormData
     *
     * @param {*} thing The value to test
     *
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    const isFormData = (thing) => {
      const pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    };

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    const isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     *
     * @returns {String} The String freed of excess whitespace
     */
    const trim = (str) => str.trim ?
      str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     *
     * @param {Boolean} [allOwnKeys = false]
     * @returns {void}
     */
    function forEach(obj, fn, {allOwnKeys = false} = {}) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      let i;
      let l;

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;

        for (i = 0; i < len; i++) {
          key = keys[i];
          fn.call(null, obj[key], key, obj);
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     *
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      const result = {};
      const assignValue = (val, key) => {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      };

      for (let i = 0, l = arguments.length; i < l; i++) {
        arguments[i] && forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     *
     * @param {Boolean} [allOwnKeys]
     * @returns {Object} The resulting value of object a
     */
    const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
      forEach(b, (val, key) => {
        if (thisArg && isFunction(val)) {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      }, {allOwnKeys});
      return a;
    };

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     *
     * @returns {string} content value without BOM
     */
    const stripBOM = (content) => {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    };

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     *
     * @returns {void}
     */
    const inherits = (constructor, superConstructor, props, descriptors) => {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      Object.defineProperty(constructor, 'super', {
        value: superConstructor.prototype
      });
      props && Object.assign(constructor.prototype, props);
    };

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function|Boolean} [filter]
     * @param {Function} [propFilter]
     *
     * @returns {Object}
     */
    const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
      let props;
      let i;
      let prop;
      const merged = {};

      destObj = destObj || {};
      // eslint-disable-next-line no-eq-null,eqeqeq
      if (sourceObj == null) return destObj;

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    };

    /**
     * Determines whether a string ends with the characters of a specified string
     *
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     *
     * @returns {boolean}
     */
    const endsWith = (str, searchString, position) => {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      const lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };


    /**
     * Returns new array from array like object or null if failed
     *
     * @param {*} [thing]
     *
     * @returns {?Array}
     */
    const toArray = (thing) => {
      if (!thing) return null;
      if (isArray(thing)) return thing;
      let i = thing.length;
      if (!isNumber(i)) return null;
      const arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    };

    /**
     * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
     * thing passed in is an instance of Uint8Array
     *
     * @param {TypedArray}
     *
     * @returns {Array}
     */
    // eslint-disable-next-line func-names
    const isTypedArray = (TypedArray => {
      // eslint-disable-next-line func-names
      return thing => {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

    /**
     * For each entry in the object, call the function with the key and value.
     *
     * @param {Object<any, any>} obj - The object to iterate over.
     * @param {Function} fn - The function to call for each entry.
     *
     * @returns {void}
     */
    const forEachEntry = (obj, fn) => {
      const generator = obj && obj[Symbol.iterator];

      const iterator = generator.call(obj);

      let result;

      while ((result = iterator.next()) && !result.done) {
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
      }
    };

    /**
     * It takes a regular expression and a string, and returns an array of all the matches
     *
     * @param {string} regExp - The regular expression to match against.
     * @param {string} str - The string to search.
     *
     * @returns {Array<boolean>}
     */
    const matchAll = (regExp, str) => {
      let matches;
      const arr = [];

      while ((matches = regExp.exec(str)) !== null) {
        arr.push(matches);
      }

      return arr;
    };

    /* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
    const isHTMLForm = kindOfTest('HTMLFormElement');

    const toCamelCase = str => {
      return str.toLowerCase().replace(/[_-\s]([a-z\d])(\w*)/g,
        function replacer(m, p1, p2) {
          return p1.toUpperCase() + p2;
        }
      );
    };

    /* Creating a function that will check if an object has a property. */
    const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

    /**
     * Determine if a value is a RegExp object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a RegExp object, otherwise false
     */
    const isRegExp = kindOfTest('RegExp');

    const reduceDescriptors = (obj, reducer) => {
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      const reducedDescriptors = {};

      forEach(descriptors, (descriptor, name) => {
        if (reducer(descriptor, name, obj) !== false) {
          reducedDescriptors[name] = descriptor;
        }
      });

      Object.defineProperties(obj, reducedDescriptors);
    };

    /**
     * Makes all methods read-only
     * @param {Object} obj
     */

    const freezeMethods = (obj) => {
      reduceDescriptors(obj, (descriptor, name) => {
        const value = obj[name];

        if (!isFunction(value)) return;

        descriptor.enumerable = false;

        if ('writable' in descriptor) {
          descriptor.writable = false;
          return;
        }

        if (!descriptor.set) {
          descriptor.set = () => {
            throw Error('Can not read-only method \'' + name + '\'');
          };
        }
      });
    };

    const toObjectSet = (arrayOrString, delimiter) => {
      const obj = {};

      const define = (arr) => {
        arr.forEach(value => {
          obj[value] = true;
        });
      };

      isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

      return obj;
    };

    const noop = () => {};

    const toFiniteNumber = (value, defaultValue) => {
      value = +value;
      return Number.isFinite(value) ? value : defaultValue;
    };

    var utils = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isBoolean,
      isObject,
      isPlainObject,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isRegExp,
      isFunction,
      isStream,
      isURLSearchParams,
      isTypedArray,
      isFileList,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      forEachEntry,
      matchAll,
      isHTMLForm,
      hasOwnProperty,
      hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
      reduceDescriptors,
      freezeMethods,
      toObjectSet,
      toCamelCase,
      noop,
      toFiniteNumber
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     *
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = (new Error()).stack;
      }

      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    const prototype$1 = AxiosError.prototype;
    const descriptors = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED',
      'ERR_NOT_SUPPORT',
      'ERR_INVALID_URL'
    // eslint-disable-next-line func-names
    ].forEach(code => {
      descriptors[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = (error, code, config, request, response, customProps) => {
      const axiosError = Object.create(prototype$1);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      }, prop => {
        return prop !== 'isAxiosError';
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.cause = error;

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    /* eslint-env browser */

    var browser = typeof self == 'object' ? self.FormData : window.FormData;

    /**
     * Determines if the given thing is a array or js object.
     *
     * @param {string} thing - The object or array to be visited.
     *
     * @returns {boolean}
     */
    function isVisitable(thing) {
      return utils.isPlainObject(thing) || utils.isArray(thing);
    }

    /**
     * It removes the brackets from the end of a string
     *
     * @param {string} key - The key of the parameter.
     *
     * @returns {string} the key without the brackets.
     */
    function removeBrackets(key) {
      return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
    }

    /**
     * It takes a path, a key, and a boolean, and returns a string
     *
     * @param {string} path - The path to the current key.
     * @param {string} key - The key of the current object being iterated over.
     * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
     *
     * @returns {string} The path to the current key.
     */
    function renderKey(path, key, dots) {
      if (!path) return key;
      return path.concat(key).map(function each(token, i) {
        // eslint-disable-next-line no-param-reassign
        token = removeBrackets(token);
        return !dots && i ? '[' + token + ']' : token;
      }).join(dots ? '.' : '');
    }

    /**
     * If the array is an array and none of its elements are visitable, then it's a flat array.
     *
     * @param {Array<any>} arr - The array to check
     *
     * @returns {boolean}
     */
    function isFlatArray(arr) {
      return utils.isArray(arr) && !arr.some(isVisitable);
    }

    const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
      return /^is[A-Z]/.test(prop);
    });

    /**
     * If the thing is a FormData object, return true, otherwise return false.
     *
     * @param {unknown} thing - The thing to check.
     *
     * @returns {boolean}
     */
    function isSpecCompliant(thing) {
      return thing && utils.isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator];
    }

    /**
     * Convert a data object to FormData
     *
     * @param {Object} obj
     * @param {?Object} [formData]
     * @param {?Object} [options]
     * @param {Function} [options.visitor]
     * @param {Boolean} [options.metaTokens = true]
     * @param {Boolean} [options.dots = false]
     * @param {?Boolean} [options.indexes = false]
     *
     * @returns {Object}
     **/

    /**
     * It converts an object into a FormData object
     *
     * @param {Object<any, any>} obj - The object to convert to form data.
     * @param {string} formData - The FormData object to append to.
     * @param {Object<string, any>} options
     *
     * @returns
     */
    function toFormData(obj, formData, options) {
      if (!utils.isObject(obj)) {
        throw new TypeError('target must be an object');
      }

      // eslint-disable-next-line no-param-reassign
      formData = formData || new (browser || FormData)();

      // eslint-disable-next-line no-param-reassign
      options = utils.toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
      }, false, function defined(option, source) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        return !utils.isUndefined(source[option]);
      });

      const metaTokens = options.metaTokens;
      // eslint-disable-next-line no-use-before-define
      const visitor = options.visitor || defaultVisitor;
      const dots = options.dots;
      const indexes = options.indexes;
      const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
      const useBlob = _Blob && isSpecCompliant(formData);

      if (!utils.isFunction(visitor)) {
        throw new TypeError('visitor must be a function');
      }

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (!useBlob && utils.isBlob(value)) {
          throw new AxiosError('Blob is not supported. Use a Buffer instead.');
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      /**
       * Default visitor.
       *
       * @param {*} value
       * @param {String|Number} key
       * @param {Array<String|Number>} path
       * @this {FormData}
       *
       * @returns {boolean} return true to visit the each prop of the value recursively
       */
      function defaultVisitor(value, key, path) {
        let arr = value;

        if (value && !path && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            key = metaTokens ? key : key.slice(0, -2);
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (
            (utils.isArray(value) && isFlatArray(value)) ||
            (utils.isFileList(value) || utils.endsWith(key, '[]') && (arr = utils.toArray(value))
            )) {
            // eslint-disable-next-line no-param-reassign
            key = removeBrackets(key);

            arr.forEach(function each(el, index) {
              !(utils.isUndefined(el) || el === null) && formData.append(
                // eslint-disable-next-line no-nested-ternary
                indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
                convertValue(el)
              );
            });
            return false;
          }
        }

        if (isVisitable(value)) {
          return true;
        }

        formData.append(renderKey(path, key, dots), convertValue(value));

        return false;
      }

      const stack = [];

      const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
      });

      function build(value, path) {
        if (utils.isUndefined(value)) return;

        if (stack.indexOf(value) !== -1) {
          throw Error('Circular reference detected in ' + path.join('.'));
        }

        stack.push(value);

        utils.forEach(value, function each(el, key) {
          const result = !(utils.isUndefined(el) || el === null) && visitor.call(
            formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
          );

          if (result === true) {
            build(el, path ? path.concat(key) : [key]);
          }
        });

        stack.pop();
      }

      if (!utils.isObject(obj)) {
        throw new TypeError('data must be an object');
      }

      build(obj);

      return formData;
    }

    /**
     * It encodes a string by replacing all characters that are not in the unreserved set with
     * their percent-encoded equivalents
     *
     * @param {string} str - The string to encode.
     *
     * @returns {string} The encoded string.
     */
    function encode$1(str) {
      const charMap = {
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '~': '%7E',
        '%20': '+',
        '%00': '\x00'
      };
      return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
      });
    }

    /**
     * It takes a params object and converts it to a FormData object
     *
     * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
     * @param {Object<string, any>} options - The options object passed to the Axios constructor.
     *
     * @returns {void}
     */
    function AxiosURLSearchParams(params, options) {
      this._pairs = [];

      params && toFormData(params, this, options);
    }

    const prototype = AxiosURLSearchParams.prototype;

    prototype.append = function append(name, value) {
      this._pairs.push([name, value]);
    };

    prototype.toString = function toString(encoder) {
      const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode$1);
      } : encode$1;

      return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + '=' + _encode(pair[1]);
      }, '').join('&');
    };

    /**
     * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
     * URI encoded counterparts
     *
     * @param {string} val The value to be encoded.
     *
     * @returns {string} The encoded value.
     */
    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @param {?object} options
     *
     * @returns {string} The formatted url
     */
    function buildURL(url, params, options) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }
      
      const _encode = options && options.encode || encode;

      const serializeFn = options && options.serialize;

      let serializedParams;

      if (serializeFn) {
        serializedParams = serializeFn(params, options);
      } else {
        serializedParams = utils.isURLSearchParams(params) ?
          params.toString() :
          new AxiosURLSearchParams(params, options).toString(_encode);
      }

      if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");

        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    }

    class InterceptorManager {
      constructor() {
        this.handlers = [];
      }

      /**
       * Add a new interceptor to the stack
       *
       * @param {Function} fulfilled The function to handle `then` for a `Promise`
       * @param {Function} rejected The function to handle `reject` for a `Promise`
       *
       * @return {Number} An ID used to remove interceptor later
       */
      use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      }

      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       *
       * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
       */
      eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }

      /**
       * Clear all interceptors from the stack
       *
       * @returns {void}
       */
      clear() {
        if (this.handlers) {
          this.handlers = [];
        }
      }

      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       *
       * @returns {void}
       */
      forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      }
    }

    var transitionalDefaults = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

    var FormData$1 = FormData;

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     *
     * @returns {boolean}
     */
    const isStandardBrowserEnv = (() => {
      let product;
      if (typeof navigator !== 'undefined' && (
        (product = navigator.product) === 'ReactNative' ||
        product === 'NativeScript' ||
        product === 'NS')
      ) {
        return false;
      }

      return typeof window !== 'undefined' && typeof document !== 'undefined';
    })();

    var platform = {
      isBrowser: true,
      classes: {
        URLSearchParams: URLSearchParams$1,
        FormData: FormData$1,
        Blob
      },
      isStandardBrowserEnv,
      protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
    };

    function toURLEncodedForm(data, options) {
      return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
        visitor: function(value, key, path, helpers) {
          if (platform.isNode && utils.isBuffer(value)) {
            this.append(key, value.toString('base64'));
            return false;
          }

          return helpers.defaultVisitor.apply(this, arguments);
        }
      }, options));
    }

    /**
     * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
     *
     * @param {string} name - The name of the property to get.
     *
     * @returns An array of strings.
     */
    function parsePropPath(name) {
      // foo[x][y][z]
      // foo.x.y.z
      // foo-x-y-z
      // foo x y z
      return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
        return match[0] === '[]' ? '' : match[1] || match[0];
      });
    }

    /**
     * Convert an array to an object.
     *
     * @param {Array<any>} arr - The array to convert to an object.
     *
     * @returns An object with the same keys and values as the array.
     */
    function arrayToObject(arr) {
      const obj = {};
      const keys = Object.keys(arr);
      let i;
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        obj[key] = arr[key];
      }
      return obj;
    }

    /**
     * It takes a FormData object and returns a JavaScript object
     *
     * @param {string} formData The FormData object to convert to JSON.
     *
     * @returns {Object<string, any> | null} The converted object.
     */
    function formDataToJSON(formData) {
      function buildPath(path, value, target, index) {
        let name = path[index++];
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && utils.isArray(target) ? target.length : name;

        if (isLast) {
          if (utils.hasOwnProp(target, name)) {
            target[name] = [target[name], value];
          } else {
            target[name] = value;
          }

          return !isNumericKey;
        }

        if (!target[name] || !utils.isObject(target[name])) {
          target[name] = [];
        }

        const result = buildPath(path, value, target[name], index);

        if (result && utils.isArray(target[name])) {
          target[name] = arrayToObject(target[name]);
        }

        return !isNumericKey;
      }

      if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
        const obj = {};

        utils.forEachEntry(formData, (name, value) => {
          buildPath(parsePropPath(name), value, obj, 0);
        });

        return obj;
      }

      return null;
    }

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     *
     * @returns {object} The response.
     */
    function settle(resolve, reject, response) {
      const validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError(
          'Request failed with status code ' + response.status,
          [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    }

    var cookies = platform.isStandardBrowserEnv ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            const cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })();

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     *
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    }

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     *
     * @returns {string} The combined URL
     */
    function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    }

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     *
     * @returns {string} The combined full path
     */
    function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    }

    var isURLSameOrigin = platform.isStandardBrowserEnv ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        const msie = /(msie|trident)/i.test(navigator.userAgent);
        const urlParsingNode = document.createElement('a');
        let originURL;

        /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
        function resolveURL(url) {
          let href = url;

          if (msie) {
            // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
        return function isURLSameOrigin(requestURL) {
          const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })();

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @param {string=} message The message.
     * @param {Object=} config The config.
     * @param {Object=} request The request.
     *
     * @returns {CanceledError} The created error.
     */
    function CanceledError(message, config, request) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError, {
      __CANCEL__: true
    });

    function parseProtocol(url) {
      const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    }

    // RawAxiosHeaders whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    const ignoreDuplicateOf = utils.toObjectSet([
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ]);

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} rawHeaders Headers needing to be parsed
     *
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = rawHeaders => {
      const parsed = {};
      let key;
      let val;
      let i;

      rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
        i = line.indexOf(':');
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();

        if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
          return;
        }

        if (key === 'set-cookie') {
          if (parsed[key]) {
            parsed[key].push(val);
          } else {
            parsed[key] = [val];
          }
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      });

      return parsed;
    };

    const $internals = Symbol('internals');
    const $defaults = Symbol('defaults');

    function normalizeHeader(header) {
      return header && String(header).trim().toLowerCase();
    }

    function normalizeValue(value) {
      if (value === false || value == null) {
        return value;
      }

      return utils.isArray(value) ? value.map(normalizeValue) : String(value);
    }

    function parseTokens(str) {
      const tokens = Object.create(null);
      const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
      let match;

      while ((match = tokensRE.exec(str))) {
        tokens[match[1]] = match[2];
      }

      return tokens;
    }

    function matchHeaderValue(context, value, header, filter) {
      if (utils.isFunction(filter)) {
        return filter.call(this, value, header);
      }

      if (!utils.isString(value)) return;

      if (utils.isString(filter)) {
        return value.indexOf(filter) !== -1;
      }

      if (utils.isRegExp(filter)) {
        return filter.test(value);
      }
    }

    function formatHeader(header) {
      return header.trim()
        .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
          return char.toUpperCase() + str;
        });
    }

    function buildAccessors(obj, header) {
      const accessorName = utils.toCamelCase(' ' + header);

      ['get', 'set', 'has'].forEach(methodName => {
        Object.defineProperty(obj, methodName + accessorName, {
          value: function(arg1, arg2, arg3) {
            return this[methodName].call(this, header, arg1, arg2, arg3);
          },
          configurable: true
        });
      });
    }

    function findKey(obj, key) {
      key = key.toLowerCase();
      const keys = Object.keys(obj);
      let i = keys.length;
      let _key;
      while (i-- > 0) {
        _key = keys[i];
        if (key === _key.toLowerCase()) {
          return _key;
        }
      }
      return null;
    }

    function AxiosHeaders(headers, defaults) {
      headers && this.set(headers);
      this[$defaults] = defaults || null;
    }

    Object.assign(AxiosHeaders.prototype, {
      set: function(header, valueOrRewrite, rewrite) {
        const self = this;

        function setHeader(_value, _header, _rewrite) {
          const lHeader = normalizeHeader(_header);

          if (!lHeader) {
            throw new Error('header name must be a non-empty string');
          }

          const key = findKey(self, lHeader);

          if (key && _rewrite !== true && (self[key] === false || _rewrite === false)) {
            return;
          }

          self[key || _header] = normalizeValue(_value);
        }

        if (utils.isPlainObject(header)) {
          utils.forEach(header, (_value, _header) => {
            setHeader(_value, _header, valueOrRewrite);
          });
        } else {
          setHeader(valueOrRewrite, header, rewrite);
        }

        return this;
      },

      get: function(header, parser) {
        header = normalizeHeader(header);

        if (!header) return undefined;

        const key = findKey(this, header);

        if (key) {
          const value = this[key];

          if (!parser) {
            return value;
          }

          if (parser === true) {
            return parseTokens(value);
          }

          if (utils.isFunction(parser)) {
            return parser.call(this, value, key);
          }

          if (utils.isRegExp(parser)) {
            return parser.exec(value);
          }

          throw new TypeError('parser must be boolean|regexp|function');
        }
      },

      has: function(header, matcher) {
        header = normalizeHeader(header);

        if (header) {
          const key = findKey(this, header);

          return !!(key && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }

        return false;
      },

      delete: function(header, matcher) {
        const self = this;
        let deleted = false;

        function deleteHeader(_header) {
          _header = normalizeHeader(_header);

          if (_header) {
            const key = findKey(self, _header);

            if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
              delete self[key];

              deleted = true;
            }
          }
        }

        if (utils.isArray(header)) {
          header.forEach(deleteHeader);
        } else {
          deleteHeader(header);
        }

        return deleted;
      },

      clear: function() {
        return Object.keys(this).forEach(this.delete.bind(this));
      },

      normalize: function(format) {
        const self = this;
        const headers = {};

        utils.forEach(this, (value, header) => {
          const key = findKey(headers, header);

          if (key) {
            self[key] = normalizeValue(value);
            delete self[header];
            return;
          }

          const normalized = format ? formatHeader(header) : String(header).trim();

          if (normalized !== header) {
            delete self[header];
          }

          self[normalized] = normalizeValue(value);

          headers[normalized] = true;
        });

        return this;
      },

      toJSON: function(asStrings) {
        const obj = Object.create(null);

        utils.forEach(Object.assign({}, this[$defaults] || null, this),
          (value, header) => {
            if (value == null || value === false) return;
            obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value;
          });

        return obj;
      }
    });

    Object.assign(AxiosHeaders, {
      from: function(thing) {
        if (utils.isString(thing)) {
          return new this(parseHeaders(thing));
        }
        return thing instanceof this ? thing : new this(thing);
      },

      accessor: function(header) {
        const internals = this[$internals] = (this[$internals] = {
          accessors: {}
        });

        const accessors = internals.accessors;
        const prototype = this.prototype;

        function defineAccessor(_header) {
          const lHeader = normalizeHeader(_header);

          if (!accessors[lHeader]) {
            buildAccessors(prototype, _header);
            accessors[lHeader] = true;
          }
        }

        utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

        return this;
      }
    });

    AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent']);

    utils.freezeMethods(AxiosHeaders.prototype);
    utils.freezeMethods(AxiosHeaders);

    /**
     * Calculate data maxRate
     * @param {Number} [samplesCount= 10]
     * @param {Number} [min= 1000]
     * @returns {Function}
     */
    function speedometer(samplesCount, min) {
      samplesCount = samplesCount || 10;
      const bytes = new Array(samplesCount);
      const timestamps = new Array(samplesCount);
      let head = 0;
      let tail = 0;
      let firstSampleTS;

      min = min !== undefined ? min : 1000;

      return function push(chunkLength) {
        const now = Date.now();

        const startedAt = timestamps[tail];

        if (!firstSampleTS) {
          firstSampleTS = now;
        }

        bytes[head] = chunkLength;
        timestamps[head] = now;

        let i = tail;
        let bytesCount = 0;

        while (i !== head) {
          bytesCount += bytes[i++];
          i = i % samplesCount;
        }

        head = (head + 1) % samplesCount;

        if (head === tail) {
          tail = (tail + 1) % samplesCount;
        }

        if (now - firstSampleTS < min) {
          return;
        }

        const passed = startedAt && now - startedAt;

        return  passed ? Math.round(bytesCount * 1000 / passed) : undefined;
      };
    }

    function progressEventReducer(listener, isDownloadStream) {
      let bytesNotified = 0;
      const _speedometer = speedometer(50, 250);

      return e => {
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : undefined;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;

        bytesNotified = loaded;

        const data = {
          loaded,
          total,
          progress: total ? (loaded / total) : undefined,
          bytes: progressBytes,
          rate: rate ? rate : undefined,
          estimated: rate && total && inRange ? (total - loaded) / rate : undefined
        };

        data[isDownloadStream ? 'download' : 'upload'] = true;

        listener(data);
      };
    }

    function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        let requestData = config.data;
        const requestHeaders = AxiosHeaders.from(config.headers).normalize();
        const responseType = config.responseType;
        let onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && platform.isStandardBrowserEnv) {
          requestHeaders.setContentType(false); // Let the browser set it
        }

        let request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          const username = config.auth.username || '';
          const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
        }

        const fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          const responseHeaders = AxiosHeaders.from(
            'getAllResponseHeaders' in request && request.getAllResponseHeaders()
          );
          const responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          const response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          const transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (platform.isStandardBrowserEnv) {
          // Add xsrf header
          const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
            && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

          if (xsrfValue) {
            requestHeaders.set(config.xsrfHeaderName, xsrfValue);
          }
        }

        // Remove Content-Type if data is undefined
        requestData === undefined && requestHeaders.setContentType(null);

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = cancel => {
            if (!request) {
              return;
            }
            reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        const protocol = parseProtocol(fullPath);

        if (protocol && platform.protocols.indexOf(protocol) === -1) {
          reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData || null);
      });
    }

    const adapters = {
      http: xhrAdapter,
      xhr: xhrAdapter
    };

    var adapters$1 = {
      getAdapter: (nameOrAdapter) => {
        if(utils.isString(nameOrAdapter)){
          const adapter = adapters[nameOrAdapter];

          if (!nameOrAdapter) {
            throw Error(
              utils.hasOwnProp(nameOrAdapter) ?
                `Adapter '${nameOrAdapter}' is not available in the build` :
                `Can not resolve adapter '${nameOrAdapter}'`
            );
          }

          return adapter
        }

        if (!utils.isFunction(nameOrAdapter)) {
          throw new TypeError('adapter is not a function');
        }

        return nameOrAdapter;
      },
      adapters
    };

    const DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    /**
     * If the browser has an XMLHttpRequest object, use the XHR adapter, otherwise use the HTTP
     * adapter
     *
     * @returns {Function}
     */
    function getDefaultAdapter() {
      let adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = adapters$1.getAdapter('xhr');
      } else if (typeof process !== 'undefined' && utils.kindOf(process) === 'process') {
        // For node use HTTP adapter
        adapter = adapters$1.getAdapter('http');
      }
      return adapter;
    }

    /**
     * It takes a string, tries to parse it, and if it fails, it returns the stringified version
     * of the input
     *
     * @param {any} rawValue - The value to be stringified.
     * @param {Function} parser - A function that parses a string into a JavaScript object.
     * @param {Function} encoder - A function that takes a value and returns a string.
     *
     * @returns {string} A stringified version of the rawValue.
     */
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    const defaults = {

      transitional: transitionalDefaults,

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        const contentType = headers.getContentType() || '';
        const hasJSONContentType = contentType.indexOf('application/json') > -1;
        const isObjectPayload = utils.isObject(data);

        if (isObjectPayload && utils.isHTMLForm(data)) {
          data = new FormData(data);
        }

        const isFormData = utils.isFormData(data);

        if (isFormData) {
          if (!hasJSONContentType) {
            return data;
          }
          return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
        }

        if (utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
          return data.toString();
        }

        let isFileList;

        if (isObjectPayload) {
          if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
            return toURLEncodedForm(data, this.formSerializer).toString();
          }

          if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
            const _FormData = this.env && this.env.FormData;

            return toFormData(
              isFileList ? {'files[]': data} : data,
              _FormData && new _FormData(),
              this.formSerializer
            );
          }
        }

        if (isObjectPayload || hasJSONContentType ) {
          headers.setContentType('application/json', false);
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        const transitional = this.transitional || defaults.transitional;
        const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        const JSONRequested = this.responseType === 'json';

        if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
          const silentJSONParsing = transitional && transitional.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;

          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    /**
     * Transform the data for a request or a response
     *
     * @param {Array|Function} fns A single function or Array of functions
     * @param {?Object} response The response object
     *
     * @returns {*} The resulting transformed data
     */
    function transformData(fns, response) {
      const config = this || defaults;
      const context = response || config;
      const headers = AxiosHeaders.from(context.headers);
      let data = context.data;

      utils.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
      });

      headers.normalize();

      return data;
    }

    function isCancel(value) {
      return !!(value && value.__CANCEL__);
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     *
     * @param {Object} config The config that is to be used for the request
     *
     * @returns {void}
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      config.headers = AxiosHeaders.from(config.headers);

      // Transform request data
      config.data = transformData.call(
        config,
        config.transformRequest
      );

      const adapter = config.adapter || defaults.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          config.transformResponse,
          response
        );

        response.headers = AxiosHeaders.from(response.headers);

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              config.transformResponse,
              reason.response
            );
            reason.response.headers = AxiosHeaders.from(reason.response.headers);
          }
        }

        return Promise.reject(reason);
      });
    }

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     *
     * @returns {Object} New object resulting from merging config2 to config1
     */
    function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      const config = {};

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      const mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'beforeRedirect': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        const merge = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge(prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    }

    const VERSION = "1.1.3";

    const validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    const deprecatedWarnings = {};

    /**
     * Transitional option validator
     *
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     *
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return (value, opt, opts) => {
        if (validator === false) {
          throw new AxiosError(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     *
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     *
     * @returns {object}
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
      }
      const keys = Object.keys(options);
      let i = keys.length;
      while (i-- > 0) {
        const opt = keys[i];
        const validator = schema[opt];
        if (validator) {
          const value = options[opt];
          const result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions,
      validators: validators$1
    };

    const validators = validator.validators;

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     *
     * @return {Axios} A new instance of Axios
     */
    class Axios {
      constructor(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager(),
          response: new InterceptorManager()
        };
      }

      /**
       * Dispatch a request
       *
       * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
       * @param {?Object} config
       *
       * @returns {Promise} The Promise to be fulfilled
       */
      request(configOrUrl, config) {
        /*eslint no-param-reassign:0*/
        // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof configOrUrl === 'string') {
          config = config || {};
          config.url = configOrUrl;
        } else {
          config = configOrUrl || {};
        }

        config = mergeConfig(this.defaults, config);

        const {transitional, paramsSerializer} = config;

        if (transitional !== undefined) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
          }, false);
        }

        if (paramsSerializer !== undefined) {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }

        // Set config.method
        config.method = (config.method || this.defaults.method || 'get').toLowerCase();

        // Flatten headers
        const defaultHeaders = config.headers && utils.merge(
          config.headers.common,
          config.headers[config.method]
        );

        defaultHeaders && utils.forEach(
          ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
          function cleanHeaderConfig(method) {
            delete config.headers[method];
          }
        );

        config.headers = new AxiosHeaders(config.headers, defaultHeaders);

        // filter out skipped interceptors
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
            return;
          }

          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });

        let promise;
        let i = 0;
        let len;

        if (!synchronousRequestInterceptors) {
          const chain = [dispatchRequest.bind(this), undefined];
          chain.unshift.apply(chain, requestInterceptorChain);
          chain.push.apply(chain, responseInterceptorChain);
          len = chain.length;

          promise = Promise.resolve(config);

          while (i < len) {
            promise = promise.then(chain[i++], chain[i++]);
          }

          return promise;
        }

        len = requestInterceptorChain.length;

        let newConfig = config;

        i = 0;

        while (i < len) {
          const onFulfilled = requestInterceptorChain[i++];
          const onRejected = requestInterceptorChain[i++];
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected.call(this, error);
            break;
          }
        }

        try {
          promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
          return Promise.reject(error);
        }

        i = 0;
        len = responseInterceptorChain.length;

        while (i < len) {
          promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }

        return promise;
      }

      getUri(config) {
        config = mergeConfig(this.defaults, config);
        const fullPath = buildFullPath(config.baseURL, config.url);
        return buildURL(fullPath, config.params, config.paramsSerializer);
      }
    }

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url,
            data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @param {Function} executor The executor function.
     *
     * @returns {CancelToken}
     */
    class CancelToken {
      constructor(executor) {
        if (typeof executor !== 'function') {
          throw new TypeError('executor must be a function.');
        }

        let resolvePromise;

        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });

        const token = this;

        // eslint-disable-next-line func-names
        this.promise.then(cancel => {
          if (!token._listeners) return;

          let i = token._listeners.length;

          while (i-- > 0) {
            token._listeners[i](cancel);
          }
          token._listeners = null;
        });

        // eslint-disable-next-line func-names
        this.promise.then = onfulfilled => {
          let _resolve;
          // eslint-disable-next-line func-names
          const promise = new Promise(resolve => {
            token.subscribe(resolve);
            _resolve = resolve;
          }).then(onfulfilled);

          promise.cancel = function reject() {
            token.unsubscribe(_resolve);
          };

          return promise;
        };

        executor(function cancel(message, config, request) {
          if (token.reason) {
            // Cancellation has already been requested
            return;
          }

          token.reason = new CanceledError(message, config, request);
          resolvePromise(token.reason);
        });
      }

      /**
       * Throws a `CanceledError` if cancellation has been requested.
       */
      throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      }

      /**
       * Subscribe to the cancel signal
       */

      subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }

        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      }

      /**
       * Unsubscribe from the cancel signal
       */

      unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }

      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
      static source() {
        let cancel;
        const token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      }
    }

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     *
     * @returns {Function}
     */
    function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    }

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     *
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    }

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     *
     * @returns {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      const context = new Axios(defaultConfig);
      const instance = bind(Axios.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios.prototype, context, {allOwnKeys: true});

      // Copy context to instance
      utils.extend(instance, context, null, {allOwnKeys: true});

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    const axios = createInstance(defaults);

    // Expose Axios class to allow class inheritance
    axios.Axios = Axios;

    // Expose Cancel & CancelToken
    axios.CanceledError = CanceledError;
    axios.CancelToken = CancelToken;
    axios.isCancel = isCancel;
    axios.VERSION = VERSION;
    axios.toFormData = toFormData;

    // Expose AxiosError class
    axios.AxiosError = AxiosError;

    // alias for CanceledError for backward compatibility
    axios.Cancel = axios.CanceledError;

    // Expose all/spread
    axios.all = function all(promises) {
      return Promise.all(promises);
    };

    axios.spread = spread;

    // Expose isAxiosError
    axios.isAxiosError = isAxiosError;

    axios.formToJSON = thing => {
      return formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
    };

    /* src\pages\Firewall-Rules.svelte generated by Svelte v3.53.1 */

    const { console: console_1$7 } = globals;
    const file$8 = "src\\pages\\Firewall-Rules.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (140:12) {#if fwr.sho}
    function create_if_block_7(ctx) {
    	let li0;
    	let t0_value = /*fwr*/ ctx[12].sho.name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*fwr*/ ctx[12].sho.ip + "";
    	let t2;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$8, 140, 12, 4425);
    			attr_dev(li1, "class", "list-group-item");
    			add_location(li1, file$8, 141, 12, 4486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[12].sho.name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[12].sho.ip + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(140:12) {#if fwr.sho}",
    		ctx
    	});

    	return block;
    }

    // (145:12) {#if fwr.shgo}
    function create_if_block_6(ctx) {
    	let li;
    	let t_value = /*fwr*/ ctx[12].shgo.name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$8, 145, 12, 4603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t_value !== (t_value = /*fwr*/ ctx[12].shgo.name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(145:12) {#if fwr.shgo}",
    		ctx
    	});

    	return block;
    }

    // (149:10) {#if fwr.sno}
    function create_if_block_5(ctx) {
    	let li0;
    	let t0_value = /*fwr*/ ctx[12].sno.name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*fwr*/ ctx[12].sno.ip + "";
    	let t2;
    	let t3_value = /*fwr*/ ctx[12].sno.subnet + "";
    	let t3;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$8, 149, 10, 4707);
    			attr_dev(li1, "class", "list-group-item");
    			add_location(li1, file$8, 150, 10, 4766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[12].sno.name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[12].sno.ip + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*firewallRules*/ 1 && t3_value !== (t3_value = /*fwr*/ ctx[12].sno.subnet + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(149:10) {#if fwr.sno}",
    		ctx
    	});

    	return block;
    }

    // (154:10) {#if fwr.sngo}
    function create_if_block_4(ctx) {
    	let li;
    	let t_value = /*fwr*/ ctx[12].sngo.name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$8, 154, 12, 4896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t_value !== (t_value = /*fwr*/ ctx[12].sngo.name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(154:10) {#if fwr.sngo}",
    		ctx
    	});

    	return block;
    }

    // (160:10) {#if fwr.dho}
    function create_if_block_3(ctx) {
    	let li0;
    	let t0_value = /*fwr*/ ctx[12].dho.name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*fwr*/ ctx[12].dho.ip + "";
    	let t2;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$8, 160, 12, 5031);
    			attr_dev(li1, "class", "list-group-item");
    			add_location(li1, file$8, 161, 12, 5092);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[12].dho.name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[12].dho.ip + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(160:10) {#if fwr.dho}",
    		ctx
    	});

    	return block;
    }

    // (165:10) {#if fwr.dhgo}
    function create_if_block_2(ctx) {
    	let li;
    	let t_value = /*fwr*/ ctx[12].dhgo.name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$8, 165, 12, 5205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t_value !== (t_value = /*fwr*/ ctx[12].dhgo.name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(165:10) {#if fwr.dhgo}",
    		ctx
    	});

    	return block;
    }

    // (169:10) {#if fwr.dno}
    function create_if_block_1(ctx) {
    	let li0;
    	let t0_value = /*fwr*/ ctx[12].dno.name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*fwr*/ ctx[12].dno.ip + "";
    	let t2;
    	let t3_value = /*fwr*/ ctx[12].dno.subnet + "";
    	let t3;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$8, 169, 12, 5311);
    			attr_dev(li1, "class", "list-group-item");
    			add_location(li1, file$8, 170, 12, 5372);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[12].dno.name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[12].dno.ip + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*firewallRules*/ 1 && t3_value !== (t3_value = /*fwr*/ ctx[12].dno.subnet + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(169:10) {#if fwr.dno}",
    		ctx
    	});

    	return block;
    }

    // (174:10) {#if fwr.dngo}
    function create_if_block$1(ctx) {
    	let li;
    	let t_value = /*fwr*/ ctx[12].dngo.name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$8, 174, 12, 5504);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t_value !== (t_value = /*fwr*/ ctx[12].dngo.name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(174:10) {#if fwr.dngo}",
    		ctx
    	});

    	return block;
    }

    // (179:12) {#each fwr.sgo.port as port}
    function create_each_block_1$4(ctx) {
    	let li;
    	let t_value = /*port*/ ctx[15] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$8, 179, 12, 5656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t_value !== (t_value = /*port*/ ctx[15] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(179:12) {#each fwr.sgo.port as port}",
    		ctx
    	});

    	return block;
    }

    // (133:6) {#each firewallRules as fwr}
    function create_each_block$7(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*fwr*/ ctx[12].fwType.name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*fwr*/ ctx[12].context.name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let td3;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let td4;
    	let t12;
    	let li;
    	let t13_value = /*fwr*/ ctx[12].sgo.name + "";
    	let t13;
    	let t14;
    	let td5;
    	let t15_value = /*fwr*/ ctx[12].uc.name + "";
    	let t15;
    	let t16;
    	let td6;
    	let t17_value = /*fwr*/ ctx[12].firewallStatus + "";
    	let t17;
    	let t18;
    	let td7;
    	let t20;
    	let td8;
    	let t22;
    	let if_block0 = /*fwr*/ ctx[12].sho && create_if_block_7(ctx);
    	let if_block1 = /*fwr*/ ctx[12].shgo && create_if_block_6(ctx);
    	let if_block2 = /*fwr*/ ctx[12].sno && create_if_block_5(ctx);
    	let if_block3 = /*fwr*/ ctx[12].sngo && create_if_block_4(ctx);
    	let if_block4 = /*fwr*/ ctx[12].dho && create_if_block_3(ctx);
    	let if_block5 = /*fwr*/ ctx[12].dhgo && create_if_block_2(ctx);
    	let if_block6 = /*fwr*/ ctx[12].dno && create_if_block_1(ctx);
    	let if_block7 = /*fwr*/ ctx[12].dngo && create_if_block$1(ctx);
    	let each_value_1 = /*fwr*/ ctx[12].sgo.port;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();
    			if (if_block3) if_block3.c();
    			t7 = space();
    			td3 = element("td");
    			if (if_block4) if_block4.c();
    			t8 = space();
    			if (if_block5) if_block5.c();
    			t9 = space();
    			if (if_block6) if_block6.c();
    			t10 = space();
    			if (if_block7) if_block7.c();
    			t11 = space();
    			td4 = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t12 = space();
    			li = element("li");
    			t13 = text(t13_value);
    			t14 = space();
    			td5 = element("td");
    			t15 = text(t15_value);
    			t16 = space();
    			td6 = element("td");
    			t17 = text(t17_value);
    			t18 = space();
    			td7 = element("td");
    			td7.textContent = "edit";
    			t20 = space();
    			td8 = element("td");
    			td8.textContent = "delete";
    			t22 = space();
    			add_location(td0, file$8, 134, 10, 4291);
    			add_location(td1, file$8, 136, 10, 4341);
    			add_location(td2, file$8, 138, 8, 4380);
    			add_location(td3, file$8, 158, 8, 4988);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$8, 181, 12, 5732);
    			add_location(td4, file$8, 177, 4, 5596);
    			add_location(td5, file$8, 183, 8, 5804);
    			add_location(td6, file$8, 184, 8, 5836);
    			add_location(td7, file$8, 185, 10, 5877);
    			add_location(td8, file$8, 186, 10, 5902);
    			add_location(tr, file$8, 133, 8, 4275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			if (if_block0) if_block0.m(td2, null);
    			append_dev(td2, t4);
    			if (if_block1) if_block1.m(td2, null);
    			append_dev(td2, t5);
    			if (if_block2) if_block2.m(td2, null);
    			append_dev(td2, t6);
    			if (if_block3) if_block3.m(td2, null);
    			append_dev(tr, t7);
    			append_dev(tr, td3);
    			if (if_block4) if_block4.m(td3, null);
    			append_dev(td3, t8);
    			if (if_block5) if_block5.m(td3, null);
    			append_dev(td3, t9);
    			if (if_block6) if_block6.m(td3, null);
    			append_dev(td3, t10);
    			if (if_block7) if_block7.m(td3, null);
    			append_dev(tr, t11);
    			append_dev(tr, td4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td4, null);
    			}

    			append_dev(td4, t12);
    			append_dev(td4, li);
    			append_dev(li, t13);
    			append_dev(tr, t14);
    			append_dev(tr, td5);
    			append_dev(td5, t15);
    			append_dev(tr, t16);
    			append_dev(tr, td6);
    			append_dev(td6, t17);
    			append_dev(tr, t18);
    			append_dev(tr, td7);
    			append_dev(tr, t20);
    			append_dev(tr, td8);
    			append_dev(tr, t22);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[12].fwType.name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[12].context.name + "")) set_data_dev(t2, t2_value);

    			if (/*fwr*/ ctx[12].sho) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(td2, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*fwr*/ ctx[12].shgo) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(td2, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*fwr*/ ctx[12].sno) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					if_block2.m(td2, t6);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*fwr*/ ctx[12].sngo) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_4(ctx);
    					if_block3.c();
    					if_block3.m(td2, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*fwr*/ ctx[12].dho) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_3(ctx);
    					if_block4.c();
    					if_block4.m(td3, t8);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*fwr*/ ctx[12].dhgo) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_2(ctx);
    					if_block5.c();
    					if_block5.m(td3, t9);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*fwr*/ ctx[12].dno) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_1(ctx);
    					if_block6.c();
    					if_block6.m(td3, t10);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*fwr*/ ctx[12].dngo) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block$1(ctx);
    					if_block7.c();
    					if_block7.m(td3, null);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (dirty & /*firewallRules*/ 1) {
    				each_value_1 = /*fwr*/ ctx[12].sgo.port;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td4, t12);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*firewallRules*/ 1 && t13_value !== (t13_value = /*fwr*/ ctx[12].sgo.name + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*firewallRules*/ 1 && t15_value !== (t15_value = /*fwr*/ ctx[12].uc.name + "")) set_data_dev(t15, t15_value);
    			if (dirty & /*firewallRules*/ 1 && t17_value !== (t17_value = /*fwr*/ ctx[12].firewallStatus + "")) set_data_dev(t17, t17_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(133:6) {#each firewallRules as fwr}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button0;
    	let t4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t5;
    	let span0;
    	let i0;
    	let t6;
    	let th1;
    	let t7;
    	let span1;
    	let i1;
    	let t8;
    	let th2;
    	let t9;
    	let span2;
    	let i2;
    	let t10;
    	let th3;
    	let t11;
    	let span3;
    	let i3;
    	let t12;
    	let th4;
    	let t13;
    	let span4;
    	let i4;
    	let t14;
    	let th5;
    	let t15;
    	let span5;
    	let i5;
    	let t16;
    	let th6;
    	let t17;
    	let span6;
    	let i6;
    	let t18;
    	let th7;
    	let t19;
    	let th8;
    	let t20;
    	let tbody;
    	let t21;
    	let p;
    	let t23;
    	let div22;
    	let div21;
    	let div20;
    	let div5;
    	let h5;
    	let t25;
    	let button1;
    	let span7;
    	let t27;
    	let div18;
    	let form;
    	let div7;
    	let div6;
    	let label0;
    	let t29;
    	let input0;
    	let t30;
    	let div9;
    	let div8;
    	let label1;
    	let t32;
    	let input1;
    	let t33;
    	let div11;
    	let div10;
    	let label2;
    	let t35;
    	let input2;
    	let t36;
    	let div13;
    	let div12;
    	let label3;
    	let t38;
    	let input3;
    	let t39;
    	let div15;
    	let div14;
    	let label4;
    	let t41;
    	let input4;
    	let t42;
    	let div17;
    	let div16;
    	let label5;
    	let t44;
    	let input5;
    	let t45;
    	let div19;
    	let button2;
    	let t47;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value = /*firewallRules*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Firewall Rules";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Firewall Rule";
    			t4 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t5 = text("FW Type ");
    			span0 = element("span");
    			i0 = element("i");
    			t6 = space();
    			th1 = element("th");
    			t7 = text("Context ");
    			span1 = element("span");
    			i1 = element("i");
    			t8 = space();
    			th2 = element("th");
    			t9 = text("Source ");
    			span2 = element("span");
    			i2 = element("i");
    			t10 = space();
    			th3 = element("th");
    			t11 = text("Destination ");
    			span3 = element("span");
    			i3 = element("i");
    			t12 = space();
    			th4 = element("th");
    			t13 = text("Ports ");
    			span4 = element("span");
    			i4 = element("i");
    			t14 = space();
    			th5 = element("th");
    			t15 = text("Use Case ");
    			span5 = element("span");
    			i5 = element("i");
    			t16 = space();
    			th6 = element("th");
    			t17 = text("Status ");
    			span6 = element("span");
    			i6 = element("i");
    			t18 = space();
    			th7 = element("th");
    			t19 = space();
    			th8 = element("th");
    			t20 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t21 = space();
    			p = element("p");
    			p.textContent = "Bearbeiten | Löschen";
    			t23 = space();
    			div22 = element("div");
    			div21 = element("div");
    			div20 = element("div");
    			div5 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Add Fireall Rule";
    			t25 = space();
    			button1 = element("button");
    			span7 = element("span");
    			span7.textContent = "×";
    			t27 = space();
    			div18 = element("div");
    			form = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "FW Type";
    			t29 = space();
    			input0 = element("input");
    			t30 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Context";
    			t32 = space();
    			input1 = element("input");
    			t33 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Source";
    			t35 = space();
    			input2 = element("input");
    			t36 = space();
    			div13 = element("div");
    			div12 = element("div");
    			label3 = element("label");
    			label3.textContent = "Destination";
    			t38 = space();
    			input3 = element("input");
    			t39 = space();
    			div15 = element("div");
    			div14 = element("div");
    			label4 = element("label");
    			label4.textContent = "Service Group Object";
    			t41 = space();
    			input4 = element("input");
    			t42 = space();
    			div17 = element("div");
    			div16 = element("div");
    			label5 = element("label");
    			label5.textContent = "Use Case";
    			t44 = space();
    			input5 = element("input");
    			t45 = space();
    			div19 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t47 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$8, 96, 8, 2323);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$8, 95, 6, 2296);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$8, 98, 6, 2413);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#createFWR");
    			set_style(button0, "margin-top", "9px");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$8, 100, 8, 2499);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "text-align-last", "right");
    			add_location(div2, file$8, 99, 6, 2440);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$8, 94, 4, 2271);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$8, 93, 2, 2236);
    			attr_dev(i0, "class", "fa fa-fw fa-sort");
    			add_location(i0, file$8, 114, 65, 3000);
    			add_location(span0, file$8, 114, 32, 2967);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$8, 114, 8, 2943);
    			attr_dev(i1, "class", "fa fa-fw fa-sort");
    			add_location(i1, file$8, 116, 66, 3178);
    			add_location(span1, file$8, 116, 32, 3144);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$8, 116, 8, 3120);
    			attr_dev(i2, "class", "fa fa-fw fa-sort");
    			add_location(i2, file$8, 118, 65, 3355);
    			add_location(span2, file$8, 118, 32, 3322);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$8, 118, 8, 3298);
    			attr_dev(i3, "class", "fa fa-fw fa-sort");
    			add_location(i3, file$8, 120, 75, 3542);
    			add_location(span3, file$8, 120, 37, 3504);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$8, 120, 8, 3475);
    			attr_dev(i4, "class", "fa fa-fw fa-sort");
    			add_location(i4, file$8, 122, 63, 3717);
    			add_location(span4, file$8, 122, 31, 3685);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$8, 122, 8, 3662);
    			attr_dev(i5, "class", "fa fa-fw fa-sort");
    			add_location(i5, file$8, 124, 68, 3897);
    			add_location(span5, file$8, 124, 34, 3863);
    			attr_dev(th5, "scope", "col");
    			add_location(th5, file$8, 124, 8, 3837);
    			attr_dev(i6, "class", "fa fa-fw fa-sort");
    			add_location(i6, file$8, 126, 73, 4082);
    			add_location(span6, file$8, 126, 32, 4041);
    			attr_dev(th6, "scope", "col");
    			add_location(th6, file$8, 126, 8, 4017);
    			attr_dev(th7, "scope", "col");
    			add_location(th7, file$8, 127, 8, 4136);
    			attr_dev(th8, "scope", "col");
    			add_location(th8, file$8, 128, 8, 4168);
    			add_location(tr, file$8, 112, 6, 2863);
    			add_location(thead, file$8, 111, 4, 2848);
    			add_location(tbody, file$8, 131, 4, 4222);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allFirwallRules");
    			add_location(table, file$8, 110, 2, 2774);
    			add_location(p, file$8, 191, 2, 5979);
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", "createFirewallRule");
    			add_location(h5, file$8, 197, 10, 6296);
    			attr_dev(span7, "aria-hidden", "true");
    			add_location(span7, file$8, 199, 12, 6467);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "close");
    			attr_dev(button1, "data-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$8, 198, 10, 6377);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$8, 196, 8, 6258);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$8, 206, 16, 6695);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "fwType");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$8, 207, 16, 6765);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$8, 205, 14, 6660);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$8, 204, 12, 6622);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "context");
    			add_location(label1, file$8, 217, 16, 7076);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "context");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$8, 218, 16, 7149);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$8, 216, 14, 7041);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$8, 215, 12, 7003);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "source");
    			add_location(label2, file$8, 228, 18, 7466);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "source");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$8, 229, 18, 7539);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$8, 227, 16, 7429);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$8, 226, 12, 7389);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "destination");
    			add_location(label3, file$8, 239, 18, 7870);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "context");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$8, 240, 18, 7953);
    			attr_dev(div12, "class", "col");
    			add_location(div12, file$8, 238, 16, 7833);
    			attr_dev(div13, "class", "row mb-3");
    			add_location(div13, file$8, 237, 14, 7793);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "sgo");
    			add_location(label4, file$8, 250, 18, 8290);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "sgo");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$8, 251, 18, 8374);
    			attr_dev(div14, "class", "col");
    			add_location(div14, file$8, 249, 16, 8253);
    			attr_dev(div15, "class", "row mb-3");
    			add_location(div15, file$8, 248, 14, 8213);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "uc");
    			add_location(label5, file$8, 261, 18, 8714);
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "id", "uc");
    			attr_dev(input5, "type", "text");
    			add_location(input5, file$8, 262, 18, 8785);
    			attr_dev(div16, "class", "col");
    			add_location(div16, file$8, 260, 16, 8677);
    			attr_dev(div17, "class", "row mb-3");
    			add_location(div17, file$8, 259, 14, 8637);
    			attr_dev(form, "class", "mb-5");
    			add_location(form, file$8, 203, 10, 6589);
    			attr_dev(div18, "class", "modal-body");
    			add_location(div18, file$8, 202, 8, 6553);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$8, 274, 10, 9119);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			add_location(button3, file$8, 275, 10, 9214);
    			attr_dev(div19, "class", "modal-footer");
    			add_location(div19, file$8, 273, 8, 9081);
    			attr_dev(div20, "class", "modal-content");
    			add_location(div20, file$8, 195, 6, 6221);
    			attr_dev(div21, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div21, "role", "document");
    			add_location(div21, file$8, 194, 4, 6149);
    			attr_dev(div22, "class", "modal fade");
    			attr_dev(div22, "id", "createFWR");
    			attr_dev(div22, "tabindex", "-1");
    			attr_dev(div22, "role", "dialog");
    			attr_dev(div22, "aria-labelledby", "formCreateFirewallRule");
    			attr_dev(div22, "aria-hidden", "true");
    			add_location(div22, file$8, 193, 2, 6016);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t5);
    			append_dev(th0, span0);
    			append_dev(span0, i0);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(th1, t7);
    			append_dev(th1, span1);
    			append_dev(span1, i1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(th2, t9);
    			append_dev(th2, span2);
    			append_dev(span2, i2);
    			append_dev(tr, t10);
    			append_dev(tr, th3);
    			append_dev(th3, t11);
    			append_dev(th3, span3);
    			append_dev(span3, i3);
    			append_dev(tr, t12);
    			append_dev(tr, th4);
    			append_dev(th4, t13);
    			append_dev(th4, span4);
    			append_dev(span4, i4);
    			append_dev(tr, t14);
    			append_dev(tr, th5);
    			append_dev(th5, t15);
    			append_dev(th5, span5);
    			append_dev(span5, i5);
    			append_dev(tr, t16);
    			append_dev(tr, th6);
    			append_dev(th6, t17);
    			append_dev(th6, span6);
    			append_dev(span6, i6);
    			append_dev(tr, t18);
    			append_dev(tr, th7);
    			append_dev(tr, t19);
    			append_dev(tr, th8);
    			append_dev(table, t20);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t21, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, div22, anchor);
    			append_dev(div22, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div5);
    			append_dev(div5, h5);
    			append_dev(div5, t25);
    			append_dev(div5, button1);
    			append_dev(button1, span7);
    			append_dev(div20, t27);
    			append_dev(div20, div18);
    			append_dev(div18, form);
    			append_dev(form, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t29);
    			append_dev(div6, input0);
    			set_input_value(input0, /*firewallRule*/ ctx[2].fwTypeId);
    			append_dev(form, t30);
    			append_dev(form, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t32);
    			append_dev(div8, input1);
    			set_input_value(input1, /*firewallRule*/ ctx[2].contextId);
    			append_dev(form, t33);
    			append_dev(form, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t35);
    			append_dev(div10, input2);
    			set_input_value(input2, /*firewallRule*/ ctx[2].sourceId);
    			append_dev(form, t36);
    			append_dev(form, div13);
    			append_dev(div13, div12);
    			append_dev(div12, label3);
    			append_dev(div12, t38);
    			append_dev(div12, input3);
    			set_input_value(input3, /*firewallRule*/ ctx[2].destinationId);
    			append_dev(form, t39);
    			append_dev(form, div15);
    			append_dev(div15, div14);
    			append_dev(div14, label4);
    			append_dev(div14, t41);
    			append_dev(div14, input4);
    			set_input_value(input4, /*firewallRule*/ ctx[2].serviceGroupObjectId);
    			append_dev(form, t42);
    			append_dev(form, div17);
    			append_dev(div17, div16);
    			append_dev(div16, label5);
    			append_dev(div16, t44);
    			append_dev(div16, input5);
    			set_input_value(input5, /*firewallRule*/ ctx[2].useCaseId);
    			append_dev(div20, t45);
    			append_dev(div20, div19);
    			append_dev(div19, button2);
    			append_dev(div19, t47);
    			append_dev(div19, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						span0,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("fwType"))) /*sort*/ ctx[1]("fwType").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						span1,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("context"))) /*sort*/ ctx[1]("context").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						span2,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("source"))) /*sort*/ ctx[1]("source").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						span3,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("destination"))) /*sort*/ ctx[1]("destination").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						span4,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("ports"))) /*sort*/ ctx[1]("ports").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						span5,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("usecase"))) /*sort*/ ctx[1]("usecase").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						span6,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("firewallStatus"))) /*sort*/ ctx[1]("firewallStatus").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[8]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[9]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[10]),
    					listen_dev(button3, "click", /*createFirewallRule*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*firewallRules*/ 1) {
    				each_value = /*firewallRules*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*firewallRule*/ 4 && input0.value !== /*firewallRule*/ ctx[2].fwTypeId) {
    				set_input_value(input0, /*firewallRule*/ ctx[2].fwTypeId);
    			}

    			if (dirty & /*firewallRule*/ 4 && input1.value !== /*firewallRule*/ ctx[2].contextId) {
    				set_input_value(input1, /*firewallRule*/ ctx[2].contextId);
    			}

    			if (dirty & /*firewallRule*/ 4 && input2.value !== /*firewallRule*/ ctx[2].sourceId) {
    				set_input_value(input2, /*firewallRule*/ ctx[2].sourceId);
    			}

    			if (dirty & /*firewallRule*/ 4 && input3.value !== /*firewallRule*/ ctx[2].destinationId) {
    				set_input_value(input3, /*firewallRule*/ ctx[2].destinationId);
    			}

    			if (dirty & /*firewallRule*/ 4 && input4.value !== /*firewallRule*/ ctx[2].serviceGroupObjectId) {
    				set_input_value(input4, /*firewallRule*/ ctx[2].serviceGroupObjectId);
    			}

    			if (dirty & /*firewallRule*/ 4 && input5.value !== /*firewallRule*/ ctx[2].useCaseId) {
    				set_input_value(input5, /*firewallRule*/ ctx[2].useCaseId);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(div22);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const api_root$7 = "http://localhost:8080";

    function instance$8($$self, $$props, $$invalidate) {
    	let sort;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Firewall_Rules', slots, []);
    	let firewallRules = [];

    	let firewallRule = {
    		fwTypeId: null,
    		contextId: null,
    		sourceId: null,
    		destinationId: null,
    		serviceGroupObjectId: null,
    		useCaseId: null
    	};

    	function getFirewallRules() {
    		var config = {
    			method: "get",
    			url: api_root$7 + "/api/service/findFwD",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(0, firewallRules = response.data);
    		}).catch(function (error) {
    			alert("Could not get Firewall Rules");
    			console.log(error);
    		});
    	}

    	getFirewallRules();

    	//-----------------------------
    	function createFirewallRule() {
    		var config = {
    			method: "post",
    			url: api_root$7 + "/firwall-rule",
    			headers: { "Content-Type": "application/json" },
    			data: firewallRule
    		};

    		axios(config).then(function (response) {
    			getFirewallRules();
    		}).catch(function (error) {
    			alert("Could not create Firewall Rules");
    			console.log(error);
    		});
    	}

    	//-----------------------------
    	let sortBy = { col: "fwType", ascending: true };

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Firewall_Rules> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		firewallRule.fwTypeId = this.value;
    		$$invalidate(2, firewallRule);
    	}

    	function input1_input_handler() {
    		firewallRule.contextId = this.value;
    		$$invalidate(2, firewallRule);
    	}

    	function input2_input_handler() {
    		firewallRule.sourceId = this.value;
    		$$invalidate(2, firewallRule);
    	}

    	function input3_input_handler() {
    		firewallRule.destinationId = this.value;
    		$$invalidate(2, firewallRule);
    	}

    	function input4_input_handler() {
    		firewallRule.serviceGroupObjectId = this.value;
    		$$invalidate(2, firewallRule);
    	}

    	function input5_input_handler() {
    		firewallRule.useCaseId = this.value;
    		$$invalidate(2, firewallRule);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		each,
    		set_now,
    		api_root: api_root$7,
    		firewallRules,
    		firewallRule,
    		getFirewallRules,
    		createFirewallRule,
    		sortBy,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('firewallRules' in $$props) $$invalidate(0, firewallRules = $$props.firewallRules);
    		if ('firewallRule' in $$props) $$invalidate(2, firewallRule = $$props.firewallRule);
    		if ('sortBy' in $$props) $$invalidate(4, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, firewallRules*/ 17) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(4, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(4, sortBy.col = column, sortBy);
    					$$invalidate(4, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(0, firewallRules = firewallRules.sort(sort));
    			});
    		}
    	};

    	return [
    		firewallRules,
    		sort,
    		firewallRule,
    		createFirewallRule,
    		sortBy,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler
    	];
    }

    class Firewall_Rules extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Firewall_Rules",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\pages\Contexts.svelte generated by Svelte v3.53.1 */

    const { console: console_1$6 } = globals;
    const file$7 = "src\\pages\\Contexts.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (152:4) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No data available";
    			add_location(div, file$7, 152, 6, 3680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(152:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (138:4) {#if visibleData.length}
    function create_if_block(ctx) {
    	let tbody;
    	let each_value = /*visibleData*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tbody, file$7, 139, 4, 3373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*visibleData*/ 1) {
    				each_value = /*visibleData*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(138:4) {#if visibleData.length}",
    		ctx
    	});

    	return block;
    }

    // (141:6) {#each visibleData as context}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*context*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*context*/ ctx[3].ip + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*context*/ ctx[3].subnet + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*context*/ ctx[3].description + "";
    	let t6;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "edit";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "delete";
    			t11 = space();
    			add_location(td0, file$7, 142, 8, 3440);
    			add_location(td1, file$7, 143, 8, 3473);
    			add_location(td2, file$7, 144, 8, 3504);
    			add_location(td3, file$7, 145, 8, 3539);
    			add_location(td4, file$7, 146, 8, 3579);
    			add_location(td5, file$7, 147, 8, 3602);
    			add_location(tr, file$7, 141, 6, 3426);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(tr, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*visibleData*/ 1 && t0_value !== (t0_value = /*context*/ ctx[3].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*visibleData*/ 1 && t2_value !== (t2_value = /*context*/ ctx[3].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*visibleData*/ 1 && t4_value !== (t4_value = /*context*/ ctx[3].subnet + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*visibleData*/ 1 && t6_value !== (t6_value = /*context*/ ctx[3].description + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(141:6) {#each visibleData as context}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div9;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button0;
    	let t4;
    	let div8;
    	let div4;
    	let input0;
    	let t5;
    	let div5;
    	let t6;
    	let div6;
    	let t7;
    	let div7;
    	let t8;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t9;
    	let span0;
    	let i;
    	let t10;
    	let th1;
    	let t12;
    	let th2;
    	let t14;
    	let th3;
    	let t16;
    	let th4;
    	let t17;
    	let th5;
    	let t18;
    	let t19;
    	let div23;
    	let div22;
    	let div21;
    	let div10;
    	let h5;
    	let t21;
    	let button1;
    	let span1;
    	let t23;
    	let div19;
    	let form;
    	let div12;
    	let div11;
    	let label0;
    	let t25;
    	let input1;
    	let t26;
    	let div14;
    	let div13;
    	let label1;
    	let t28;
    	let input2;
    	let t29;
    	let div16;
    	let div15;
    	let label2;
    	let t31;
    	let input3;
    	let t32;
    	let div18;
    	let div17;
    	let label3;
    	let t34;
    	let input4;
    	let t35;
    	let div20;
    	let button2;
    	let t37;
    	let button3;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*visibleData*/ ctx[0].length) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Contexts";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Context";
    			t4 = space();
    			div8 = element("div");
    			div4 = element("div");
    			input0 = element("input");
    			t5 = space();
    			div5 = element("div");
    			t6 = space();
    			div6 = element("div");
    			t7 = space();
    			div7 = element("div");
    			t8 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t9 = text("Name ");
    			span0 = element("span");
    			i = element("i");
    			t10 = space();
    			th1 = element("th");
    			th1.textContent = "IP";
    			t12 = space();
    			th2 = element("th");
    			th2.textContent = "Subnet";
    			t14 = space();
    			th3 = element("th");
    			th3.textContent = "Description";
    			t16 = space();
    			th4 = element("th");
    			t17 = space();
    			th5 = element("th");
    			t18 = space();
    			if_block.c();
    			t19 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div10 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Add Context";
    			t21 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t23 = space();
    			div19 = element("div");
    			form = element("form");
    			div12 = element("div");
    			div11 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t25 = space();
    			input1 = element("input");
    			t26 = space();
    			div14 = element("div");
    			div13 = element("div");
    			label1 = element("label");
    			label1.textContent = "IP";
    			t28 = space();
    			input2 = element("input");
    			t29 = space();
    			div16 = element("div");
    			div15 = element("div");
    			label2 = element("label");
    			label2.textContent = "Subnet";
    			t31 = space();
    			input3 = element("input");
    			t32 = space();
    			div18 = element("div");
    			div17 = element("div");
    			label3 = element("label");
    			label3.textContent = "Description";
    			t34 = space();
    			input4 = element("input");
    			t35 = space();
    			div20 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t37 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$7, 96, 8, 2106);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$7, 95, 6, 2079);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$7, 98, 6, 2190);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#createC");
    			set_style(button0, "margin-top", "19px");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$7, 100, 8, 2276);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "text-align-last", "right");
    			add_location(div2, file$7, 99, 6, 2217);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$7, 94, 4, 2054);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "search");
    			attr_dev(input0, "type", "text");
    			set_style(input0, "margin-bottom", "10px");
    			attr_dev(input0, "placeholder", "search...");
    			add_location(input0, file$7, 111, 4, 2588);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$7, 110, 6, 2565);
    			attr_dev(div5, "class", "col");
    			add_location(div5, file$7, 120, 2, 2780);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$7, 121, 2, 2802);
    			attr_dev(div7, "class", "col");
    			add_location(div7, file$7, 122, 2, 2824);
    			attr_dev(div8, "class", "row g-3");
    			add_location(div8, file$7, 109, 4, 2536);
    			attr_dev(div9, "class", "container-fluid");
    			add_location(div9, file$7, 93, 0, 2019);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$7, 129, 60, 3083);
    			add_location(span0, file$7, 129, 29, 3052);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$7, 129, 8, 3031);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$7, 130, 8, 3137);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$7, 131, 8, 3170);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$7, 132, 8, 3207);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$7, 133, 8, 3249);
    			attr_dev(th5, "scope", "col");
    			add_location(th5, file$7, 134, 8, 3281);
    			add_location(tr, file$7, 127, 6, 2951);
    			add_location(thead, file$7, 126, 4, 2936);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allContexts");
    			add_location(table, file$7, 125, 2, 2866);
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", "crateContext");
    			add_location(h5, file$7, 161, 10, 4014);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$7, 163, 12, 4174);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "close");
    			attr_dev(button1, "data-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$7, 162, 10, 4084);
    			attr_dev(div10, "class", "modal-header");
    			add_location(div10, file$7, 160, 8, 3976);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$7, 170, 16, 4402);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$7, 171, 16, 4469);
    			attr_dev(div11, "class", "col");
    			add_location(div11, file$7, 169, 14, 4367);
    			attr_dev(div12, "class", "row mb-3");
    			add_location(div12, file$7, 168, 12, 4329);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "ip");
    			add_location(label1, file$7, 181, 18, 4777);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "description");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$7, 182, 18, 4842);
    			attr_dev(div13, "class", "col");
    			add_location(div13, file$7, 180, 16, 4740);
    			attr_dev(div14, "class", "row mb-3");
    			add_location(div14, file$7, 179, 14, 4700);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "subnet");
    			add_location(label2, file$7, 192, 18, 5163);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "description");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$7, 193, 18, 5236);
    			attr_dev(div15, "class", "col");
    			add_location(div15, file$7, 191, 16, 5126);
    			attr_dev(div16, "class", "row mb-3");
    			add_location(div16, file$7, 190, 14, 5086);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "description");
    			add_location(label3, file$7, 203, 16, 5569);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "description");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$7, 204, 16, 5650);
    			attr_dev(div17, "class", "col");
    			add_location(div17, file$7, 202, 14, 5534);
    			attr_dev(div18, "class", "row mb-3");
    			add_location(div18, file$7, 201, 16, 5496);
    			attr_dev(form, "class", "mb-5");
    			add_location(form, file$7, 167, 10, 4296);
    			attr_dev(div19, "class", "modal-body");
    			add_location(div19, file$7, 166, 8, 4260);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$7, 215, 10, 5952);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			attr_dev(button3, "data-dismiss", "modal");
    			add_location(button3, file$7, 216, 10, 6047);
    			attr_dev(div20, "class", "modal-footer");
    			add_location(div20, file$7, 214, 8, 5914);
    			attr_dev(div21, "class", "modal-content");
    			add_location(div21, file$7, 159, 6, 3939);
    			attr_dev(div22, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div22, "role", "document");
    			add_location(div22, file$7, 158, 4, 3867);
    			attr_dev(div23, "class", "modal fade");
    			attr_dev(div23, "id", "createC");
    			attr_dev(div23, "tabindex", "-1");
    			attr_dev(div23, "role", "dialog");
    			attr_dev(div23, "aria-labelledby", "formCreateContext");
    			attr_dev(div23, "aria-hidden", "true");
    			add_location(div23, file$7, 157, 2, 3741);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div9, t4);
    			append_dev(div9, div8);
    			append_dev(div8, div4);
    			append_dev(div4, input0);
    			set_input_value(input0, /*searchText*/ ctx[1]);
    			append_dev(div8, t5);
    			append_dev(div8, div5);
    			append_dev(div8, t6);
    			append_dev(div8, div6);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t9);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t10);
    			append_dev(tr, th1);
    			append_dev(tr, t12);
    			append_dev(tr, th2);
    			append_dev(tr, t14);
    			append_dev(tr, th3);
    			append_dev(tr, t16);
    			append_dev(tr, th4);
    			append_dev(tr, t17);
    			append_dev(tr, th5);
    			append_dev(table, t18);
    			if_block.m(table, null);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div23, anchor);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div10);
    			append_dev(div10, h5);
    			append_dev(div10, t21);
    			append_dev(div10, button1);
    			append_dev(button1, span1);
    			append_dev(div21, t23);
    			append_dev(div21, div19);
    			append_dev(div19, form);
    			append_dev(form, div12);
    			append_dev(div12, div11);
    			append_dev(div11, label0);
    			append_dev(div11, t25);
    			append_dev(div11, input1);
    			set_input_value(input1, /*context*/ ctx[3].name);
    			append_dev(form, t26);
    			append_dev(form, div14);
    			append_dev(div14, div13);
    			append_dev(div13, label1);
    			append_dev(div13, t28);
    			append_dev(div13, input2);
    			set_input_value(input2, /*context*/ ctx[3].ip);
    			append_dev(form, t29);
    			append_dev(form, div16);
    			append_dev(div16, div15);
    			append_dev(div15, label2);
    			append_dev(div15, t31);
    			append_dev(div15, input3);
    			set_input_value(input3, /*context*/ ctx[3].subnet);
    			append_dev(form, t32);
    			append_dev(form, div18);
    			append_dev(div18, div17);
    			append_dev(div17, label3);
    			append_dev(div17, t34);
    			append_dev(div17, input4);
    			set_input_value(input4, /*context*/ ctx[3].description);
    			append_dev(div21, t35);
    			append_dev(div21, div20);
    			append_dev(div20, button2);
    			append_dev(div20, t37);
    			append_dev(div20, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(
    						span0,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[2]("name"))) /*sort*/ ctx[2]("name").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[10]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[11]),
    					listen_dev(button3, "click", /*createContext*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*searchText*/ 2 && input0.value !== /*searchText*/ ctx[1]) {
    				set_input_value(input0, /*searchText*/ ctx[1]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(table, null);
    				}
    			}

    			if (dirty & /*context*/ 8 && input1.value !== /*context*/ ctx[3].name) {
    				set_input_value(input1, /*context*/ ctx[3].name);
    			}

    			if (dirty & /*context*/ 8 && input2.value !== /*context*/ ctx[3].ip) {
    				set_input_value(input2, /*context*/ ctx[3].ip);
    			}

    			if (dirty & /*context*/ 8 && input3.value !== /*context*/ ctx[3].subnet) {
    				set_input_value(input3, /*context*/ ctx[3].subnet);
    			}

    			if (dirty & /*context*/ 8 && input4.value !== /*context*/ ctx[3].description) {
    				set_input_value(input4, /*context*/ ctx[3].description);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(table);
    			if_block.d();
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div23);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const api_root$6 = "http://localhost:8080";

    function instance$7($$self, $$props, $$invalidate) {
    	let sort;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contexts', slots, []);
    	let contexts = [];

    	let context = {
    		name: null,
    		ip: null,
    		subnet: null,
    		description: null
    	};

    	let visibleData;
    	let searchText;

    	function getContexts() {
    		var config = {
    			method: "get",
    			url: api_root$6 + "/context",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(5, contexts = response.data);
    		}).catch(function (error) {
    			alert("Could not get Contexts");
    			console.log(error);
    		});
    	}

    	getContexts();

    	function createContext() {
    		var config = {
    			method: "post",
    			url: api_root$6 + "/context",
    			headers: { "Content-Type": "application/json" },
    			data: context
    		};

    		axios(config).then(function (response) {
    			getContexts();
    		}).catch(function (error) {
    			alert("Could not create Context");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Contexts> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		searchText = this.value;
    		$$invalidate(1, searchText);
    	}

    	function input1_input_handler() {
    		context.name = this.value;
    		$$invalidate(3, context);
    	}

    	function input2_input_handler() {
    		context.ip = this.value;
    		$$invalidate(3, context);
    	}

    	function input3_input_handler() {
    		context.subnet = this.value;
    		$$invalidate(3, context);
    	}

    	function input4_input_handler() {
    		context.description = this.value;
    		$$invalidate(3, context);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		api_root: api_root$6,
    		contexts,
    		context,
    		visibleData,
    		searchText,
    		getContexts,
    		createContext,
    		sortBy,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('contexts' in $$props) $$invalidate(5, contexts = $$props.contexts);
    		if ('context' in $$props) $$invalidate(3, context = $$props.context);
    		if ('visibleData' in $$props) $$invalidate(0, visibleData = $$props.visibleData);
    		if ('searchText' in $$props) $$invalidate(1, searchText = $$props.searchText);
    		if ('sortBy' in $$props) $$invalidate(6, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(2, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*searchText, contexts*/ 34) {
    			{
    				$$invalidate(0, visibleData = searchText
    				? contexts.filter(e => {
    						return e.name.toLowerCase().match(`${searchText.toLowerCase()}.*`) || e.ip.match(`${searchText}.*`);
    					})
    				: contexts);
    			}
    		}

    		if ($$self.$$.dirty & /*sortBy, visibleData*/ 65) {
    			$$invalidate(2, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(6, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(6, sortBy.col = column, sortBy);
    					$$invalidate(6, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(0, visibleData = visibleData.sort(sort));
    			});
    		}
    	};

    	return [
    		visibleData,
    		searchText,
    		sort,
    		context,
    		createContext,
    		contexts,
    		sortBy,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class Contexts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contexts",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\pages\Host-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$5 } = globals;
    const file$6 = "src\\pages\\Host-Objects.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (113:4) {#each hostObjects as hostObject}
    function create_each_block$5(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*hostObject*/ ctx[2].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*hostObject*/ ctx[2].ip + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*hostObject*/ ctx[2].description + "";
    	let t4;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "edit";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "delete";
    			t9 = space();
    			add_location(td0, file$6, 114, 8, 2820);
    			add_location(td1, file$6, 115, 8, 2856);
    			add_location(td2, file$6, 116, 8, 2890);
    			add_location(td3, file$6, 117, 8, 2933);
    			add_location(td4, file$6, 118, 8, 2956);
    			add_location(tr, file$6, 113, 6, 2806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hostObjects*/ 1 && t0_value !== (t0_value = /*hostObject*/ ctx[2].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*hostObjects*/ 1 && t2_value !== (t2_value = /*hostObject*/ ctx[2].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*hostObjects*/ 1 && t4_value !== (t4_value = /*hostObject*/ ctx[2].description + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(113:4) {#each hostObjects as hostObject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button0;
    	let t4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t5;
    	let span0;
    	let i0;
    	let t6;
    	let th1;
    	let t7;
    	let i1;
    	let t8;
    	let th2;
    	let t9;
    	let i2;
    	let t10;
    	let th3;
    	let t11;
    	let th4;
    	let t12;
    	let tbody;
    	let t13;
    	let p;
    	let t15;
    	let div16;
    	let div15;
    	let div14;
    	let div5;
    	let h5;
    	let t17;
    	let button1;
    	let span1;
    	let t19;
    	let div12;
    	let form;
    	let div7;
    	let div6;
    	let label0;
    	let t21;
    	let input0;
    	let t22;
    	let div9;
    	let div8;
    	let label1;
    	let t24;
    	let input1;
    	let t25;
    	let div11;
    	let div10;
    	let label2;
    	let t27;
    	let input2;
    	let t28;
    	let div13;
    	let button2;
    	let t30;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value = /*hostObjects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "All Host Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Host-Object";
    			t4 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t5 = text("Name  ");
    			span0 = element("span");
    			i0 = element("i");
    			t6 = space();
    			th1 = element("th");
    			t7 = text("IP  ");
    			i1 = element("i");
    			t8 = space();
    			th2 = element("th");
    			t9 = text("Description  ");
    			i2 = element("i");
    			t10 = space();
    			th3 = element("th");
    			t11 = space();
    			th4 = element("th");
    			t12 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			p = element("p");
    			p.textContent = "Bearbeiten | Löschen";
    			t15 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Add Host-Object";
    			t17 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t19 = space();
    			div12 = element("div");
    			form = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t21 = space();
    			input0 = element("input");
    			t22 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "IP";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Description";
    			t27 = space();
    			input2 = element("input");
    			t28 = space();
    			div13 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t30 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$6, 86, 6, 1796);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$6, 85, 4, 1771);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$6, 88, 4, 1884);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#crateHO");
    			set_style(button0, "margin-top", "9px");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$6, 90, 6, 1966);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "text-align-last", "right");
    			add_location(div2, file$6, 89, 4, 1909);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$6, 84, 2, 1748);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$6, 83, 0, 1715);
    			attr_dev(i0, "class", "fa fa-fw fa-sort");
    			add_location(i0, file$6, 104, 59, 2430);
    			add_location(span0, file$6, 104, 28, 2399);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$6, 104, 6, 2377);
    			attr_dev(i1, "class", "fa fa-fw fa-sort");
    			add_location(i1, file$6, 105, 48, 2524);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$6, 105, 6, 2482);
    			attr_dev(i2, "class", "fa fa-fw fa-sort");
    			add_location(i2, file$6, 106, 66, 2629);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$6, 106, 6, 2569);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$6, 107, 6, 2674);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$6, 108, 6, 2704);
    			add_location(tr, file$6, 102, 4, 2301);
    			add_location(thead, file$6, 101, 2, 2288);
    			add_location(tbody, file$6, 111, 2, 2752);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allHostObjects");
    			add_location(table, file$6, 100, 0, 2217);
    			add_location(p, file$6, 123, 0, 3021);
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", "crateHostObject");
    			add_location(h5, file$6, 129, 8, 3322);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$6, 131, 10, 3485);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "close");
    			attr_dev(button1, "data-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$6, 130, 8, 3397);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$6, 128, 6, 3286);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$6, 138, 14, 3699);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "H_<ZONE>_<HOST-NAME>");
    			add_location(input0, file$6, 139, 14, 3764);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$6, 137, 12, 3666);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$6, 136, 10, 3630);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "ip");
    			add_location(label1, file$6, 150, 14, 4099);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "ip");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$6, 151, 14, 4160);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$6, 149, 12, 4066);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$6, 148, 10, 4030);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "description");
    			add_location(label2, file$6, 161, 14, 4439);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "description");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$6, 162, 14, 4518);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$6, 160, 12, 4406);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$6, 159, 10, 4370);
    			attr_dev(form, "class", "mb-5");
    			add_location(form, file$6, 135, 8, 3599);
    			attr_dev(div12, "class", "modal-body");
    			add_location(div12, file$6, 134, 6, 3565);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$6, 173, 8, 4809);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			add_location(button3, file$6, 174, 8, 4902);
    			attr_dev(div13, "class", "modal-footer");
    			add_location(div13, file$6, 172, 6, 4773);
    			attr_dev(div14, "class", "modal-content");
    			add_location(div14, file$6, 127, 4, 3251);
    			attr_dev(div15, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div15, "role", "document");
    			add_location(div15, file$6, 126, 2, 3181);
    			attr_dev(div16, "class", "modal fade");
    			attr_dev(div16, "id", "crateHO");
    			attr_dev(div16, "tabindex", "-1");
    			attr_dev(div16, "role", "dialog");
    			attr_dev(div16, "aria-labelledby", "formCreateHostObject");
    			attr_dev(div16, "aria-hidden", "true");
    			add_location(div16, file$6, 125, 0, 3054);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t5);
    			append_dev(th0, span0);
    			append_dev(span0, i0);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(th1, t7);
    			append_dev(th1, i1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(th2, t9);
    			append_dev(th2, i2);
    			append_dev(tr, t10);
    			append_dev(tr, th3);
    			append_dev(tr, t11);
    			append_dev(tr, th4);
    			append_dev(table, t12);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t13, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			append_dev(div5, h5);
    			append_dev(div5, t17);
    			append_dev(div5, button1);
    			append_dev(button1, span1);
    			append_dev(div14, t19);
    			append_dev(div14, div12);
    			append_dev(div12, form);
    			append_dev(form, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t21);
    			append_dev(div6, input0);
    			set_input_value(input0, /*hostObject*/ ctx[2].name);
    			append_dev(form, t22);
    			append_dev(form, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t24);
    			append_dev(div8, input1);
    			set_input_value(input1, /*hostObject*/ ctx[2].ip);
    			append_dev(form, t25);
    			append_dev(form, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t27);
    			append_dev(div10, input2);
    			set_input_value(input2, /*hostObject*/ ctx[2].description);
    			append_dev(div14, t28);
    			append_dev(div14, div13);
    			append_dev(div13, button2);
    			append_dev(div13, t30);
    			append_dev(div13, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						span0,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("name"))) /*sort*/ ctx[1]("name").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						th1,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("ip"))) /*sort*/ ctx[1]("ip").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						th2,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("description"))) /*sort*/ ctx[1]("description").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(button3, "click", /*createHostObject*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*hostObjects*/ 1) {
    				each_value = /*hostObjects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*hostObject*/ 4 && input0.value !== /*hostObject*/ ctx[2].name) {
    				set_input_value(input0, /*hostObject*/ ctx[2].name);
    			}

    			if (dirty & /*hostObject*/ 4 && input1.value !== /*hostObject*/ ctx[2].ip) {
    				set_input_value(input1, /*hostObject*/ ctx[2].ip);
    			}

    			if (dirty & /*hostObject*/ 4 && input2.value !== /*hostObject*/ ctx[2].description) {
    				set_input_value(input2, /*hostObject*/ ctx[2].description);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div16);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const api_root$5 = "http://localhost:8080";

    function instance$6($$self, $$props, $$invalidate) {
    	let sort;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Host_Objects', slots, []);
    	let hostObjects = [];
    	let hostObject = { name: null, ip: null, description: null };

    	function getHostObjects() {
    		var config = {
    			method: "get",
    			url: api_root$5 + "/host-object",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(0, hostObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Host Objects");
    			console.log(error);
    		});
    	}

    	getHostObjects();

    	function createHostObject() {
    		var config = {
    			method: "post",
    			url: api_root$5 + "/host-object",
    			headers: { "Content-Type": "application/json" },
    			data: hostObject
    		};

    		axios(config).then(function (response) {
    			alert("Host Object created");
    			getHostObjects();
    		}).catch(function (error) {
    			alert("Could not create Host Object");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Host_Objects> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		hostObject.name = this.value;
    		$$invalidate(2, hostObject);
    	}

    	function input1_input_handler() {
    		hostObject.ip = this.value;
    		$$invalidate(2, hostObject);
    	}

    	function input2_input_handler() {
    		hostObject.description = this.value;
    		$$invalidate(2, hostObject);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		api_root: api_root$5,
    		hostObjects,
    		hostObject,
    		getHostObjects,
    		createHostObject,
    		sortBy,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('hostObjects' in $$props) $$invalidate(0, hostObjects = $$props.hostObjects);
    		if ('hostObject' in $$props) $$invalidate(2, hostObject = $$props.hostObject);
    		if ('sortBy' in $$props) $$invalidate(4, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, hostObjects*/ 17) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(4, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(4, sortBy.col = column, sortBy);
    					$$invalidate(4, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(0, hostObjects = hostObjects.sort(sort));
    			});
    		}
    	};

    	return [
    		hostObjects,
    		sort,
    		hostObject,
    		createHostObject,
    		sortBy,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Host_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Host_Objects",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\pages\Network-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$4 } = globals;
    const file$5 = "src\\pages\\Network-Objects.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (137:4) {#each visibleData as networkObject}
    function create_each_block$4(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*networkObject*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*networkObject*/ ctx[3].ip + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*networkObject*/ ctx[3].subnet + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*networkObject*/ ctx[3].description + "";
    	let t6;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "edit";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "delete";
    			t11 = space();
    			add_location(td0, file$5, 138, 8, 3633);
    			add_location(td1, file$5, 139, 8, 3672);
    			add_location(td2, file$5, 140, 8, 3709);
    			add_location(td3, file$5, 141, 8, 3750);
    			add_location(td4, file$5, 142, 8, 3796);
    			add_location(td5, file$5, 143, 8, 3819);
    			add_location(tr, file$5, 137, 6, 3619);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(tr, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*visibleData*/ 1 && t0_value !== (t0_value = /*networkObject*/ ctx[3].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*visibleData*/ 1 && t2_value !== (t2_value = /*networkObject*/ ctx[3].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*visibleData*/ 1 && t4_value !== (t4_value = /*networkObject*/ ctx[3].subnet + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*visibleData*/ 1 && t6_value !== (t6_value = /*networkObject*/ ctx[3].description + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(137:4) {#each visibleData as networkObject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div9;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button0;
    	let t4;
    	let div8;
    	let div4;
    	let input0;
    	let t5;
    	let div5;
    	let t6;
    	let div6;
    	let t7;
    	let div7;
    	let t8;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t9;
    	let span0;
    	let i0;
    	let t10;
    	let th1;
    	let t11;
    	let i1;
    	let t12;
    	let th2;
    	let t13;
    	let i2;
    	let t14;
    	let th3;
    	let t15;
    	let i3;
    	let t16;
    	let th4;
    	let t17;
    	let th5;
    	let t18;
    	let tbody;
    	let t19;
    	let p;
    	let t21;
    	let div23;
    	let div22;
    	let div21;
    	let div10;
    	let h5;
    	let t23;
    	let button1;
    	let span1;
    	let t25;
    	let div19;
    	let form;
    	let div12;
    	let div11;
    	let label0;
    	let t27;
    	let input1;
    	let t28;
    	let div14;
    	let div13;
    	let label1;
    	let t30;
    	let input2;
    	let t31;
    	let div16;
    	let div15;
    	let label2;
    	let t33;
    	let input3;
    	let t34;
    	let div18;
    	let div17;
    	let label3;
    	let t36;
    	let input4;
    	let t37;
    	let div20;
    	let button2;
    	let t39;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value = /*visibleData*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Network Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Network-Object";
    			t4 = space();
    			div8 = element("div");
    			div4 = element("div");
    			input0 = element("input");
    			t5 = space();
    			div5 = element("div");
    			t6 = space();
    			div6 = element("div");
    			t7 = space();
    			div7 = element("div");
    			t8 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t9 = text("Name  ");
    			span0 = element("span");
    			i0 = element("i");
    			t10 = space();
    			th1 = element("th");
    			t11 = text("IP  ");
    			i1 = element("i");
    			t12 = space();
    			th2 = element("th");
    			t13 = text("Subnet  ");
    			i2 = element("i");
    			t14 = space();
    			th3 = element("th");
    			t15 = text("Description  ");
    			i3 = element("i");
    			t16 = space();
    			th4 = element("th");
    			t17 = space();
    			th5 = element("th");
    			t18 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t19 = space();
    			p = element("p");
    			p.textContent = "Bearbeiten | Löschen";
    			t21 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div10 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Add Network-Object";
    			t23 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t25 = space();
    			div19 = element("div");
    			form = element("form");
    			div12 = element("div");
    			div11 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t27 = space();
    			input1 = element("input");
    			t28 = space();
    			div14 = element("div");
    			div13 = element("div");
    			label1 = element("label");
    			label1.textContent = "IP";
    			t30 = space();
    			input2 = element("input");
    			t31 = space();
    			div16 = element("div");
    			div15 = element("div");
    			label2 = element("label");
    			label2.textContent = "Subent";
    			t33 = space();
    			input3 = element("input");
    			t34 = space();
    			div18 = element("div");
    			div17 = element("div");
    			label3 = element("label");
    			label3.textContent = "Description";
    			t36 = space();
    			input4 = element("input");
    			t37 = space();
    			div20 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t39 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$5, 94, 6, 2215);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$5, 93, 4, 2190);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$5, 96, 4, 2302);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#crateHO");
    			set_style(button0, "margin-top", "9px");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$5, 98, 6, 2384);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "text-align-last", "right");
    			add_location(div2, file$5, 97, 4, 2327);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$5, 92, 2, 2167);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "search");
    			attr_dev(input0, "type", "text");
    			set_style(input0, "margin-bottom", "10px");
    			attr_dev(input0, "placeholder", "search...");
    			add_location(input0, file$5, 109, 2, 2680);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$5, 108, 4, 2659);
    			attr_dev(div5, "class", "col");
    			add_location(div5, file$5, 118, 0, 2854);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$5, 119, 0, 2874);
    			attr_dev(div7, "class", "col");
    			add_location(div7, file$5, 120, 0, 2894);
    			attr_dev(div8, "class", "row g-3");
    			add_location(div8, file$5, 107, 2, 2632);
    			attr_dev(div9, "class", "container-fluid");
    			add_location(div9, file$5, 91, 0, 2134);
    			attr_dev(i0, "class", "fa fa-fw fa-sort");
    			add_location(i0, file$5, 127, 59, 3145);
    			add_location(span0, file$5, 127, 28, 3114);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$5, 127, 6, 3092);
    			attr_dev(i1, "class", "fa fa-fw fa-sort");
    			add_location(i1, file$5, 128, 48, 3239);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$5, 128, 6, 3197);
    			attr_dev(i2, "class", "fa fa-fw fa-sort");
    			add_location(i2, file$5, 129, 56, 3334);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$5, 129, 6, 3284);
    			attr_dev(i3, "class", "fa fa-fw fa-sort");
    			add_location(i3, file$5, 130, 66, 3439);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$5, 130, 6, 3379);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$5, 131, 6, 3484);
    			attr_dev(th5, "scope", "col");
    			add_location(th5, file$5, 132, 6, 3514);
    			add_location(tr, file$5, 125, 4, 3016);
    			add_location(thead, file$5, 124, 2, 3003);
    			add_location(tbody, file$5, 135, 2, 3562);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allHostObjects");
    			add_location(table, file$5, 123, 0, 2932);
    			add_location(p, file$5, 148, 0, 3884);
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", "crateHostObject");
    			add_location(h5, file$5, 154, 8, 4185);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$5, 156, 10, 4351);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "close");
    			attr_dev(button1, "data-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$5, 155, 8, 4263);
    			attr_dev(div10, "class", "modal-header");
    			add_location(div10, file$5, 153, 6, 4149);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$5, 163, 14, 4565);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "N_<ZONE>_<NETZWERK-NAME>");
    			add_location(input1, file$5, 164, 14, 4630);
    			attr_dev(div11, "class", "col");
    			add_location(div11, file$5, 162, 12, 4532);
    			attr_dev(div12, "class", "row mb-3");
    			add_location(div12, file$5, 161, 10, 4496);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "ip");
    			add_location(label1, file$5, 175, 14, 4972);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "ip");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$5, 176, 14, 5033);
    			attr_dev(div13, "class", "col");
    			add_location(div13, file$5, 174, 12, 4939);
    			attr_dev(div14, "class", "row mb-3");
    			add_location(div14, file$5, 173, 10, 4903);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "subnet");
    			add_location(label2, file$5, 186, 16, 5321);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "subnet");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$5, 187, 16, 5392);
    			attr_dev(div15, "class", "col");
    			add_location(div15, file$5, 185, 14, 5286);
    			attr_dev(div16, "class", "row mb-3");
    			add_location(div16, file$5, 184, 12, 5248);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "description");
    			add_location(label3, file$5, 197, 14, 5700);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "description");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$5, 198, 14, 5779);
    			attr_dev(div17, "class", "col");
    			add_location(div17, file$5, 196, 12, 5667);
    			attr_dev(div18, "class", "row mb-3");
    			add_location(div18, file$5, 195, 14, 5631);
    			attr_dev(form, "class", "mb-5");
    			add_location(form, file$5, 160, 8, 4465);
    			attr_dev(div19, "class", "modal-body");
    			add_location(div19, file$5, 159, 6, 4431);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$5, 209, 8, 6073);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			add_location(button3, file$5, 210, 8, 6166);
    			attr_dev(div20, "class", "modal-footer");
    			add_location(div20, file$5, 208, 6, 6037);
    			attr_dev(div21, "class", "modal-content");
    			add_location(div21, file$5, 152, 4, 4114);
    			attr_dev(div22, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div22, "role", "document");
    			add_location(div22, file$5, 151, 2, 4044);
    			attr_dev(div23, "class", "modal fade");
    			attr_dev(div23, "id", "crateHO");
    			attr_dev(div23, "tabindex", "-1");
    			attr_dev(div23, "role", "dialog");
    			attr_dev(div23, "aria-labelledby", "formCreateHostObject");
    			attr_dev(div23, "aria-hidden", "true");
    			add_location(div23, file$5, 150, 0, 3917);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div9, t4);
    			append_dev(div9, div8);
    			append_dev(div8, div4);
    			append_dev(div4, input0);
    			set_input_value(input0, /*searchText*/ ctx[1]);
    			append_dev(div8, t5);
    			append_dev(div8, div5);
    			append_dev(div8, t6);
    			append_dev(div8, div6);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t9);
    			append_dev(th0, span0);
    			append_dev(span0, i0);
    			append_dev(tr, t10);
    			append_dev(tr, th1);
    			append_dev(th1, t11);
    			append_dev(th1, i1);
    			append_dev(tr, t12);
    			append_dev(tr, th2);
    			append_dev(th2, t13);
    			append_dev(th2, i2);
    			append_dev(tr, t14);
    			append_dev(tr, th3);
    			append_dev(th3, t15);
    			append_dev(th3, i3);
    			append_dev(tr, t16);
    			append_dev(tr, th4);
    			append_dev(tr, t17);
    			append_dev(tr, th5);
    			append_dev(table, t18);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t19, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, div23, anchor);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div10);
    			append_dev(div10, h5);
    			append_dev(div10, t23);
    			append_dev(div10, button1);
    			append_dev(button1, span1);
    			append_dev(div21, t25);
    			append_dev(div21, div19);
    			append_dev(div19, form);
    			append_dev(form, div12);
    			append_dev(div12, div11);
    			append_dev(div11, label0);
    			append_dev(div11, t27);
    			append_dev(div11, input1);
    			set_input_value(input1, /*networkObject*/ ctx[3].name);
    			append_dev(form, t28);
    			append_dev(form, div14);
    			append_dev(div14, div13);
    			append_dev(div13, label1);
    			append_dev(div13, t30);
    			append_dev(div13, input2);
    			set_input_value(input2, /*networkObject*/ ctx[3].ip);
    			append_dev(form, t31);
    			append_dev(form, div16);
    			append_dev(div16, div15);
    			append_dev(div15, label2);
    			append_dev(div15, t33);
    			append_dev(div15, input3);
    			set_input_value(input3, /*networkObject*/ ctx[3].subnet);
    			append_dev(form, t34);
    			append_dev(form, div18);
    			append_dev(div18, div17);
    			append_dev(div17, label3);
    			append_dev(div17, t36);
    			append_dev(div17, input4);
    			set_input_value(input4, /*networkObject*/ ctx[3].description);
    			append_dev(div21, t37);
    			append_dev(div21, div20);
    			append_dev(div20, button2);
    			append_dev(div20, t39);
    			append_dev(div20, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(
    						span0,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[2]("name"))) /*sort*/ ctx[2]("name").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						th1,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[2]("ip"))) /*sort*/ ctx[2]("ip").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						th2,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[2]("subnet"))) /*sort*/ ctx[2]("subnet").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						th3,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[2]("description"))) /*sort*/ ctx[2]("description").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[10]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[11]),
    					listen_dev(button3, "click", /*createNetworkObject*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*searchText*/ 2 && input0.value !== /*searchText*/ ctx[1]) {
    				set_input_value(input0, /*searchText*/ ctx[1]);
    			}

    			if (dirty & /*visibleData*/ 1) {
    				each_value = /*visibleData*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*networkObject*/ 8 && input1.value !== /*networkObject*/ ctx[3].name) {
    				set_input_value(input1, /*networkObject*/ ctx[3].name);
    			}

    			if (dirty & /*networkObject*/ 8 && input2.value !== /*networkObject*/ ctx[3].ip) {
    				set_input_value(input2, /*networkObject*/ ctx[3].ip);
    			}

    			if (dirty & /*networkObject*/ 8 && input3.value !== /*networkObject*/ ctx[3].subnet) {
    				set_input_value(input3, /*networkObject*/ ctx[3].subnet);
    			}

    			if (dirty & /*networkObject*/ 8 && input4.value !== /*networkObject*/ ctx[3].description) {
    				set_input_value(input4, /*networkObject*/ ctx[3].description);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div23);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const api_root$4 = "http://localhost:8080";

    function instance$5($$self, $$props, $$invalidate) {
    	let sort;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Network_Objects', slots, []);
    	let networkObjects = [];

    	let networkObject = {
    		name: null,
    		ip: null,
    		subnet: null,
    		description: null
    	};

    	let visibleData;
    	let searchText;

    	function getNetworkObjects() {
    		var config = {
    			method: "get",
    			url: api_root$4 + "/network-object",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(5, networkObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Network Objects");
    			console.log(error);
    		});
    	}

    	getNetworkObjects();

    	function createNetworkObject() {
    		var config = {
    			method: "post",
    			url: api_root$4 + "/network-object",
    			headers: { "Content-Type": "application/json" },
    			data: networkObject
    		};

    		axios(config).then(function (response) {
    			alert("Network Object created");
    			getNetworkObjects();
    		}).catch(function (error) {
    			alert("Could not create Network Object");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Network_Objects> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		searchText = this.value;
    		$$invalidate(1, searchText);
    	}

    	function input1_input_handler() {
    		networkObject.name = this.value;
    		$$invalidate(3, networkObject);
    	}

    	function input2_input_handler() {
    		networkObject.ip = this.value;
    		$$invalidate(3, networkObject);
    	}

    	function input3_input_handler() {
    		networkObject.subnet = this.value;
    		$$invalidate(3, networkObject);
    	}

    	function input4_input_handler() {
    		networkObject.description = this.value;
    		$$invalidate(3, networkObject);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		HostObjects: Host_Objects,
    		api_root: api_root$4,
    		networkObjects,
    		networkObject,
    		visibleData,
    		searchText,
    		getNetworkObjects,
    		createNetworkObject,
    		sortBy,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('networkObjects' in $$props) $$invalidate(5, networkObjects = $$props.networkObjects);
    		if ('networkObject' in $$props) $$invalidate(3, networkObject = $$props.networkObject);
    		if ('visibleData' in $$props) $$invalidate(0, visibleData = $$props.visibleData);
    		if ('searchText' in $$props) $$invalidate(1, searchText = $$props.searchText);
    		if ('sortBy' in $$props) $$invalidate(6, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(2, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*searchText, networkObjects*/ 34) {
    			{
    				$$invalidate(0, visibleData = searchText
    				? networkObjects.filter(e => {
    						return e.name.toLowerCase().match(`${searchText.toLowerCase()}.*`) || e.ip.match(`${searchText}.*`) || e.description.toLowerCase().match(`${searchText.toLowerCase()}.*`);
    					})
    				: networkObjects);
    			}
    		}

    		if ($$self.$$.dirty & /*sortBy, visibleData*/ 65) {
    			$$invalidate(2, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(6, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(6, sortBy.col = column, sortBy);
    					$$invalidate(6, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(0, visibleData = visibleData.sort(sort));
    			});
    		}
    	};

    	return [
    		visibleData,
    		searchText,
    		sort,
    		networkObject,
    		createNetworkObject,
    		networkObjects,
    		sortBy,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class Network_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Network_Objects",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\Network-Group-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$3 } = globals;
    const file$4 = "src\\pages\\Network-Group-Objects.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (148:8) {#each n1.members as member}
    function create_each_block_2$1(ctx) {
    	let li0;
    	let t0_value = /*member*/ ctx[18].name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*member*/ ctx[18].ip + "";
    	let t2;
    	let t3_value = /*member*/ ctx[18].subnet + "";
    	let t3;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$4, 148, 8, 3581);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$4, 149, 8, 3637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*networkGroupObjects*/ 1 && t0_value !== (t0_value = /*member*/ ctx[18].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*networkGroupObjects*/ 1 && t2_value !== (t2_value = /*member*/ ctx[18].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*networkGroupObjects*/ 1 && t3_value !== (t3_value = /*member*/ ctx[18].subnet + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(148:8) {#each n1.members as member}",
    		ctx
    	});

    	return block;
    }

    // (144:4) {#each networkGroupObjects as n1}
    function create_each_block_1$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*n1*/ ctx[15].ngoName + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let td2;
    	let t3_value = /*n1*/ ctx[15].ngoDescription + "";
    	let t3;
    	let t4;
    	let td3;
    	let t6;
    	let td4;
    	let t8;
    	let each_value_2 = /*n1*/ ctx[15].members;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			td3.textContent = "edit";
    			t6 = space();
    			td4 = element("td");
    			td4.textContent = "delete";
    			t8 = space();
    			add_location(td0, file$4, 145, 8, 3498);
    			add_location(td1, file$4, 146, 8, 3529);
    			add_location(td2, file$4, 152, 8, 3768);
    			add_location(td3, file$4, 153, 8, 3806);
    			add_location(td4, file$4, 154, 8, 3829);
    			add_location(tr, file$4, 144, 6, 3484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td1, null);
    			}

    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*networkGroupObjects*/ 1 && t0_value !== (t0_value = /*n1*/ ctx[15].ngoName + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*networkGroupObjects*/ 1) {
    				each_value_2 = /*n1*/ ctx[15].members;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty & /*networkGroupObjects*/ 1 && t3_value !== (t3_value = /*n1*/ ctx[15].ngoDescription + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(144:4) {#each networkGroupObjects as n1}",
    		ctx
    	});

    	return block;
    }

    // (202:14) {#each networkObjects as n}
    function create_each_block$3(ctx) {
    	let option;
    	let t_value = /*n*/ ctx[12].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*n*/ ctx[12].id;
    			option.value = option.__value;
    			add_location(option, file$4, 204, 14, 5666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*networkObjects*/ 8 && t_value !== (t_value = /*n*/ ctx[12].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*networkObjects*/ 8 && option_value_value !== (option_value_value = /*n*/ ctx[12].id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(202:14) {#each networkObjects as n}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button0;
    	let t4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t5;
    	let span0;
    	let i;
    	let t6;
    	let th1;
    	let t8;
    	let th2;
    	let t10;
    	let th3;
    	let t11;
    	let th4;
    	let t12;
    	let tbody;
    	let t13;
    	let p;
    	let t15;
    	let div16;
    	let div15;
    	let div14;
    	let div5;
    	let h5;
    	let t17;
    	let button1;
    	let span1;
    	let t19;
    	let div12;
    	let form;
    	let div7;
    	let div6;
    	let label0;
    	let t21;
    	let input0;
    	let t22;
    	let div9;
    	let div8;
    	let label1;
    	let t24;
    	let input1;
    	let t25;
    	let div11;
    	let div10;
    	let label2;
    	let t27;
    	let select;
    	let t28;
    	let div13;
    	let button2;
    	let t30;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*networkGroupObjects*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*networkObjects*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "All Network Group Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Network-Group-Object";
    			t4 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t5 = text("Name ");
    			span0 = element("span");
    			i = element("i");
    			t6 = space();
    			th1 = element("th");
    			th1.textContent = "Members";
    			t8 = space();
    			th2 = element("th");
    			th2.textContent = "Description";
    			t10 = space();
    			th3 = element("th");
    			t11 = space();
    			th4 = element("th");
    			t12 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t13 = space();
    			p = element("p");
    			p.textContent = "Bearbeiten | Löschen";
    			t15 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Add Host-Group-Object";
    			t17 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t19 = space();
    			div12 = element("div");
    			form = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t21 = space();
    			input0 = element("input");
    			t22 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Description";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Members";
    			t27 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t28 = space();
    			div13 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t30 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$4, 116, 6, 2505);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$4, 115, 4, 2480);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$4, 118, 4, 2602);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#crateHO");
    			set_style(button0, "margin-top", "9px");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$4, 120, 6, 2684);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "text-align-last", "right");
    			add_location(div2, file$4, 119, 4, 2627);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$4, 114, 2, 2457);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$4, 113, 0, 2424);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$4, 134, 61, 3159);
    			add_location(span0, file$4, 134, 27, 3125);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$4, 134, 6, 3104);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$4, 136, 6, 3275);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$4, 137, 6, 3311);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$4, 138, 6, 3352);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$4, 139, 6, 3382);
    			add_location(tr, file$4, 132, 4, 3028);
    			add_location(thead, file$4, 131, 2, 3015);
    			add_location(tbody, file$4, 142, 2, 3430);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allHostObjects");
    			add_location(table, file$4, 130, 0, 2944);
    			add_location(p, file$4, 159, 0, 3896);
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", "crateHostObject");
    			add_location(h5, file$4, 165, 8, 4197);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$4, 167, 10, 4366);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "close");
    			attr_dev(button1, "data-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$4, 166, 8, 4278);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$4, 164, 6, 4161);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$4, 174, 14, 4580);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "HG_<ZONE>_<HOST-ART>");
    			add_location(input0, file$4, 175, 14, 4645);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$4, 173, 12, 4547);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$4, 172, 10, 4511);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$4, 186, 14, 4988);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "description");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$4, 187, 14, 5067);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$4, 185, 12, 4955);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$4, 184, 10, 4919);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "membersId");
    			add_location(label2, file$4, 199, 14, 5403);
    			attr_dev(select, "id", "membersId");
    			attr_dev(select, "type", "text");
    			attr_dev(select, "class", "form-control");
    			if (/*networkGroupObject*/ ctx[2].membersId === void 0) add_render_callback(() => /*select_change_handler*/ ctx[8].call(select));
    			add_location(select, file$4, 200, 12, 5474);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$4, 197, 12, 5353);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$4, 196, 12, 5317);
    			attr_dev(form, "class", "mb-5");
    			add_location(form, file$4, 171, 8, 4480);
    			attr_dev(div12, "class", "modal-body");
    			add_location(div12, file$4, 170, 6, 4446);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$4, 214, 8, 5895);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			add_location(button3, file$4, 215, 8, 5988);
    			attr_dev(div13, "class", "modal-footer");
    			add_location(div13, file$4, 213, 6, 5859);
    			attr_dev(div14, "class", "modal-content");
    			add_location(div14, file$4, 163, 4, 4126);
    			attr_dev(div15, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div15, "role", "document");
    			add_location(div15, file$4, 162, 2, 4056);
    			attr_dev(div16, "class", "modal fade");
    			attr_dev(div16, "id", "crateHO");
    			attr_dev(div16, "tabindex", "-1");
    			attr_dev(div16, "role", "dialog");
    			attr_dev(div16, "aria-labelledby", "formCreateHostObject");
    			attr_dev(div16, "aria-hidden", "true");
    			add_location(div16, file$4, 161, 0, 3929);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t5);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(tr, t10);
    			append_dev(tr, th3);
    			append_dev(tr, t11);
    			append_dev(tr, th4);
    			append_dev(table, t12);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tbody, null);
    			}

    			insert_dev(target, t13, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			append_dev(div5, h5);
    			append_dev(div5, t17);
    			append_dev(div5, button1);
    			append_dev(button1, span1);
    			append_dev(div14, t19);
    			append_dev(div14, div12);
    			append_dev(div12, form);
    			append_dev(form, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t21);
    			append_dev(div6, input0);
    			set_input_value(input0, /*networkGroupObject*/ ctx[2].name);
    			append_dev(form, t22);
    			append_dev(form, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t24);
    			append_dev(div8, input1);
    			set_input_value(input1, /*networkGroupObject*/ ctx[2].description);
    			append_dev(form, t25);
    			append_dev(form, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t27);
    			append_dev(div10, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*networkGroupObject*/ ctx[2].membersId);
    			append_dev(div14, t28);
    			append_dev(div14, div13);
    			append_dev(div13, button2);
    			append_dev(div13, t30);
    			append_dev(div13, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						span0,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("ngoName"))) /*sort*/ ctx[1]("ngoName").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[8]),
    					listen_dev(button3, "click", /*createNetworkGroupObject*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*networkGroupObjects*/ 1) {
    				each_value_1 = /*networkGroupObjects*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*networkGroupObject, networkObjects*/ 12 && input0.value !== /*networkGroupObject*/ ctx[2].name) {
    				set_input_value(input0, /*networkGroupObject*/ ctx[2].name);
    			}

    			if (dirty & /*networkGroupObject, networkObjects*/ 12 && input1.value !== /*networkGroupObject*/ ctx[2].description) {
    				set_input_value(input1, /*networkGroupObject*/ ctx[2].description);
    			}

    			if (dirty & /*networkObjects*/ 8) {
    				each_value = /*networkObjects*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*networkGroupObject, networkObjects*/ 12) {
    				select_option(select, /*networkGroupObject*/ ctx[2].membersId);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div16);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const api_root$3 = "http://localhost:8080";

    function instance$4($$self, $$props, $$invalidate) {
    	let sort;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Network_Group_Objects', slots, []);
    	let networkGroupObjects = [];

    	let networkGroupObject = {
    		name: null,
    		description: null,
    		membersId: null
    	};

    	function addMembersId() {
    		networkGroupObject.membersId.push;
    	}

    	function getNetworkGroupObjects() {
    		var config = {
    			method: "get",
    			url: api_root$3 + "/api/service/findNo",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(0, networkGroupObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Network Group Objects");
    			console.log(error);
    		});
    	}

    	getNetworkGroupObjects();

    	//-----------------------------
    	function createNetworkGroupObject() {
    		var config = {
    			method: "post",
    			url: api_root$3 + "/network-group-object",
    			headers: { "Content-Type": "application/json" },
    			data: networkGroupObject
    		};

    		axios(config).then(function (response) {
    			alert("Network Group Object created");
    			getNetworkGroupObjects();
    		}).catch(function (error) {
    			alert("Could not create Network Group Object");
    			console.log(error);
    		});
    	}

    	//-----------------------------
    	let networkObjects = [];

    	function getNetworkObjects() {
    		var config = {
    			method: "get",
    			url: api_root$3 + "/network-object",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(3, networkObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Network Objects");
    			console.log(error);
    		});
    	}

    	getNetworkObjects();

    	//-----------------------------
    	let sortBy = { col: "name", ascending: true };

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Network_Group_Objects> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		networkGroupObject.name = this.value;
    		$$invalidate(2, networkGroupObject);
    		$$invalidate(3, networkObjects);
    	}

    	function input1_input_handler() {
    		networkGroupObject.description = this.value;
    		$$invalidate(2, networkGroupObject);
    		$$invalidate(3, networkObjects);
    	}

    	function select_change_handler() {
    		networkGroupObject.membersId = select_value(this);
    		$$invalidate(2, networkGroupObject);
    		$$invalidate(3, networkObjects);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		api_root: api_root$3,
    		networkGroupObjects,
    		networkGroupObject,
    		addMembersId,
    		getNetworkGroupObjects,
    		createNetworkGroupObject,
    		networkObjects,
    		getNetworkObjects,
    		sortBy,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('networkGroupObjects' in $$props) $$invalidate(0, networkGroupObjects = $$props.networkGroupObjects);
    		if ('networkGroupObject' in $$props) $$invalidate(2, networkGroupObject = $$props.networkGroupObject);
    		if ('networkObjects' in $$props) $$invalidate(3, networkObjects = $$props.networkObjects);
    		if ('sortBy' in $$props) $$invalidate(5, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, networkGroupObjects*/ 33) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(5, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(5, sortBy.col = column, sortBy);
    					$$invalidate(5, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(0, networkGroupObjects = networkGroupObjects.sort(sort));
    			});
    		}
    	};

    	return [
    		networkGroupObjects,
    		sort,
    		networkGroupObject,
    		networkObjects,
    		createNetworkGroupObject,
    		sortBy,
    		input0_input_handler,
    		input1_input_handler,
    		select_change_handler
    	];
    }

    class Network_Group_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Network_Group_Objects",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\pages\Host-Group-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$2 } = globals;
    const file$3 = "src\\pages\\Host-Group-Objects.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (144:8) {#each h1.members as member}
    function create_each_block_2(ctx) {
    	let li0;
    	let t0_value = /*member*/ ctx[16].name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*member*/ ctx[16].ip + "";
    	let t2;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$3, 144, 8, 3437);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$3, 145, 8, 3493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hostGroupObjects*/ 1 && t0_value !== (t0_value = /*member*/ ctx[16].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*hostGroupObjects*/ 1 && t2_value !== (t2_value = /*member*/ ctx[16].ip + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(144:8) {#each h1.members as member}",
    		ctx
    	});

    	return block;
    }

    // (140:4) {#each hostGroupObjects as h1}
    function create_each_block_1$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*h1*/ ctx[13].hgoName + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let td2;
    	let t3_value = /*h1*/ ctx[13].hgoDescription + "";
    	let t3;
    	let t4;
    	let td3;
    	let t6;
    	let td4;
    	let t8;
    	let each_value_2 = /*h1*/ ctx[13].members;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			td3.textContent = "edit";
    			t6 = space();
    			td4 = element("td");
    			td4.textContent = "delete";
    			t8 = space();
    			add_location(td0, file$3, 141, 8, 3354);
    			add_location(td1, file$3, 142, 8, 3385);
    			add_location(td2, file$3, 148, 8, 3609);
    			add_location(td3, file$3, 149, 8, 3647);
    			add_location(td4, file$3, 150, 8, 3670);
    			add_location(tr, file$3, 140, 6, 3340);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td1, null);
    			}

    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hostGroupObjects*/ 1 && t0_value !== (t0_value = /*h1*/ ctx[13].hgoName + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*hostGroupObjects*/ 1) {
    				each_value_2 = /*h1*/ ctx[13].members;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty & /*hostGroupObjects*/ 1 && t3_value !== (t3_value = /*h1*/ ctx[13].hgoDescription + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(140:4) {#each hostGroupObjects as h1}",
    		ctx
    	});

    	return block;
    }

    // (198:14) {#each hostObjects as h}
    function create_each_block$2(ctx) {
    	let option;
    	let t_value = /*h*/ ctx[10].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*h*/ ctx[10].id;
    			option.value = option.__value;
    			add_location(option, file$3, 200, 14, 5456);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hostObjects*/ 8 && t_value !== (t_value = /*h*/ ctx[10].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*hostObjects*/ 8 && option_value_value !== (option_value_value = /*h*/ ctx[10].id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(198:14) {#each hostObjects as h}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button0;
    	let t4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t5;
    	let span0;
    	let i;
    	let t6;
    	let th1;
    	let t8;
    	let th2;
    	let t10;
    	let th3;
    	let t11;
    	let th4;
    	let t12;
    	let tbody;
    	let t13;
    	let p;
    	let t15;
    	let div16;
    	let div15;
    	let div14;
    	let div5;
    	let h5;
    	let t17;
    	let button1;
    	let span1;
    	let t19;
    	let div12;
    	let form;
    	let div7;
    	let div6;
    	let label0;
    	let t21;
    	let input0;
    	let t22;
    	let div9;
    	let div8;
    	let label1;
    	let t24;
    	let input1;
    	let t25;
    	let div11;
    	let div10;
    	let label2;
    	let t27;
    	let select;
    	let t28;
    	let div13;
    	let button2;
    	let t30;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*hostGroupObjects*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*hostObjects*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "All Host Group Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Host-Group-Object";
    			t4 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t5 = text("Name ");
    			span0 = element("span");
    			i = element("i");
    			t6 = space();
    			th1 = element("th");
    			th1.textContent = "Members";
    			t8 = space();
    			th2 = element("th");
    			th2.textContent = "Description";
    			t10 = space();
    			th3 = element("th");
    			t11 = space();
    			th4 = element("th");
    			t12 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t13 = space();
    			p = element("p");
    			p.textContent = "Bearbeiten | Löschen";
    			t15 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Add Host-Group-Object";
    			t17 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t19 = space();
    			div12 = element("div");
    			form = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t21 = space();
    			input0 = element("input");
    			t22 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Description";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Members";
    			t27 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t28 = space();
    			div13 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t30 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$3, 112, 6, 2370);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$3, 111, 4, 2345);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$3, 114, 4, 2464);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#crateHO");
    			set_style(button0, "margin-top", "9px");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$3, 116, 6, 2546);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "text-align-last", "right");
    			add_location(div2, file$3, 115, 4, 2489);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$3, 110, 2, 2322);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$3, 109, 0, 2289);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$3, 130, 61, 3018);
    			add_location(span0, file$3, 130, 27, 2984);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$3, 130, 6, 2963);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$3, 132, 6, 3134);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$3, 133, 6, 3170);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$3, 134, 6, 3211);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$3, 135, 6, 3241);
    			add_location(tr, file$3, 128, 4, 2887);
    			add_location(thead, file$3, 127, 2, 2874);
    			add_location(tbody, file$3, 138, 2, 3289);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allHostObjects");
    			add_location(table, file$3, 126, 0, 2803);
    			add_location(p, file$3, 155, 0, 3737);
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", "crateHostObject");
    			add_location(h5, file$3, 161, 8, 4038);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$3, 163, 10, 4207);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "close");
    			attr_dev(button1, "data-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$3, 162, 8, 4119);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$3, 160, 6, 4002);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$3, 170, 14, 4421);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "HG_<ZONE>_<HOST-ART>");
    			add_location(input0, file$3, 171, 14, 4486);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$3, 169, 12, 4388);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$3, 168, 10, 4352);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$3, 182, 14, 4826);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "description");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$3, 183, 14, 4905);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$3, 181, 12, 4793);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$3, 180, 10, 4757);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "membersId");
    			add_location(label2, file$3, 195, 14, 5238);
    			attr_dev(select, "id", "membersId");
    			attr_dev(select, "type", "text");
    			attr_dev(select, "class", "form-control");
    			add_location(select, file$3, 196, 12, 5309);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$3, 193, 12, 5188);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$3, 192, 12, 5152);
    			attr_dev(form, "class", "mb-5");
    			add_location(form, file$3, 167, 8, 4321);
    			attr_dev(div12, "class", "modal-body");
    			add_location(div12, file$3, 166, 6, 4287);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$3, 210, 8, 5685);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			add_location(button3, file$3, 211, 8, 5778);
    			attr_dev(div13, "class", "modal-footer");
    			add_location(div13, file$3, 209, 6, 5649);
    			attr_dev(div14, "class", "modal-content");
    			add_location(div14, file$3, 159, 4, 3967);
    			attr_dev(div15, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div15, "role", "document");
    			add_location(div15, file$3, 158, 2, 3897);
    			attr_dev(div16, "class", "modal fade");
    			attr_dev(div16, "id", "crateHO");
    			attr_dev(div16, "tabindex", "-1");
    			attr_dev(div16, "role", "dialog");
    			attr_dev(div16, "aria-labelledby", "formCreateHostObject");
    			attr_dev(div16, "aria-hidden", "true");
    			add_location(div16, file$3, 157, 0, 3770);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t5);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(tr, t10);
    			append_dev(tr, th3);
    			append_dev(tr, t11);
    			append_dev(tr, th4);
    			append_dev(table, t12);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tbody, null);
    			}

    			insert_dev(target, t13, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			append_dev(div5, h5);
    			append_dev(div5, t17);
    			append_dev(div5, button1);
    			append_dev(button1, span1);
    			append_dev(div14, t19);
    			append_dev(div14, div12);
    			append_dev(div12, form);
    			append_dev(form, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t21);
    			append_dev(div6, input0);
    			set_input_value(input0, /*hostGroupObject*/ ctx[2].name);
    			append_dev(form, t22);
    			append_dev(form, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t24);
    			append_dev(div8, input1);
    			set_input_value(input1, /*hostGroupObject*/ ctx[2].description);
    			append_dev(form, t25);
    			append_dev(form, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t27);
    			append_dev(div10, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			append_dev(div14, t28);
    			append_dev(div14, div13);
    			append_dev(div13, button2);
    			append_dev(div13, t30);
    			append_dev(div13, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						span0,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("hgoName"))) /*sort*/ ctx[1]("hgoName").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(button3, "click", /*createHostGroupObject*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*hostGroupObjects*/ 1) {
    				each_value_1 = /*hostGroupObjects*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*hostGroupObject*/ 4 && input0.value !== /*hostGroupObject*/ ctx[2].name) {
    				set_input_value(input0, /*hostGroupObject*/ ctx[2].name);
    			}

    			if (dirty & /*hostGroupObject*/ 4 && input1.value !== /*hostGroupObject*/ ctx[2].description) {
    				set_input_value(input1, /*hostGroupObject*/ ctx[2].description);
    			}

    			if (dirty & /*hostObjects*/ 8) {
    				each_value = /*hostObjects*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div16);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const api_root$2 = "http://localhost:8080";

    function instance$3($$self, $$props, $$invalidate) {
    	let sort;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Host_Group_Objects', slots, []);
    	let hostGroupObjects = [];

    	let hostGroupObject = {
    		name: null,
    		description: null,
    		membersId: null
    	};

    	function getHostGroupObjects() {
    		var config = {
    			method: "get",
    			url: api_root$2 + "/api/service/findHo",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(0, hostGroupObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Host Group Objects");
    			console.log(error);
    		});
    	}

    	getHostGroupObjects();

    	//-----------------------------
    	function createHostGroupObject() {
    		var config = {
    			method: "post",
    			url: api_root$2 + "/host-group-object",
    			headers: { "Content-Type": "application/json" },
    			data: hostGroupObject
    		};

    		axios(config).then(function (response) {
    			alert("Host Group Object created");
    			getHostGroupObjects();
    		}).catch(function (error) {
    			alert("Could not create Host Group Object");
    			console.log(error);
    		});
    	}

    	//-----------------------------
    	let hostObjects = [];

    	function getHostObjects() {
    		var config = {
    			method: "get",
    			url: api_root$2 + "/host-object",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(3, hostObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Host Objects");
    			console.log(error);
    		});
    	}

    	getHostObjects();

    	//-----------------------------
    	let sortBy = { col: "name", ascending: true };

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Host_Group_Objects> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		hostGroupObject.name = this.value;
    		$$invalidate(2, hostGroupObject);
    	}

    	function input1_input_handler() {
    		hostGroupObject.description = this.value;
    		$$invalidate(2, hostGroupObject);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		api_root: api_root$2,
    		hostGroupObjects,
    		hostGroupObject,
    		getHostGroupObjects,
    		createHostGroupObject,
    		hostObjects,
    		getHostObjects,
    		sortBy,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('hostGroupObjects' in $$props) $$invalidate(0, hostGroupObjects = $$props.hostGroupObjects);
    		if ('hostGroupObject' in $$props) $$invalidate(2, hostGroupObject = $$props.hostGroupObject);
    		if ('hostObjects' in $$props) $$invalidate(3, hostObjects = $$props.hostObjects);
    		if ('sortBy' in $$props) $$invalidate(5, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, hostGroupObjects*/ 33) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(5, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(5, sortBy.col = column, sortBy);
    					$$invalidate(5, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(0, hostGroupObjects = hostGroupObjects.sort(sort));
    			});
    		}
    	};

    	return [
    		hostGroupObjects,
    		sort,
    		hostGroupObject,
    		hostObjects,
    		createHostGroupObject,
    		sortBy,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Host_Group_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Host_Group_Objects",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Service-Group-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\pages\\Service-Group-Objects.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (121:12) {#each serviceGroupObject.port as port}
    function create_each_block_1$1(ctx) {
    	let li;
    	let t_value = /*port*/ ctx[11] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$2, 121, 10, 3405);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*serviceGroupObjects*/ 1 && t_value !== (t_value = /*port*/ ctx[11] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(121:12) {#each serviceGroupObject.port as port}",
    		ctx
    	});

    	return block;
    }

    // (117:6) {#each serviceGroupObjects as serviceGroupObject}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*serviceGroupObject*/ ctx[2].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let td2;
    	let t3_value = /*serviceGroupObject*/ ctx[2].description + "";
    	let t3;
    	let t4;
    	let td3;
    	let t6;
    	let td4;
    	let t8;
    	let each_value_1 = /*serviceGroupObject*/ ctx[2].port;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			td3.textContent = "edit";
    			t6 = space();
    			td4 = element("td");
    			td4.textContent = "delete";
    			t8 = space();
    			add_location(td0, file$2, 118, 10, 3290);
    			add_location(td1, file$2, 119, 10, 3336);
    			add_location(td2, file$2, 124, 10, 3490);
    			add_location(td3, file$2, 125, 10, 3543);
    			add_location(td4, file$2, 126, 10, 3568);
    			add_location(tr, file$2, 117, 8, 3274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td1, null);
    			}

    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*serviceGroupObjects*/ 1 && t0_value !== (t0_value = /*serviceGroupObject*/ ctx[2].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*serviceGroupObjects*/ 1) {
    				each_value_1 = /*serviceGroupObject*/ ctx[2].port;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*serviceGroupObjects*/ 1 && t3_value !== (t3_value = /*serviceGroupObject*/ ctx[2].description + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(117:6) {#each serviceGroupObjects as serviceGroupObject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button0;
    	let t4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t5;
    	let span0;
    	let i;
    	let t6;
    	let th1;
    	let t8;
    	let th2;
    	let t10;
    	let th3;
    	let t11;
    	let th4;
    	let t12;
    	let tbody;
    	let t13;
    	let p;
    	let t15;
    	let div16;
    	let div15;
    	let div14;
    	let div5;
    	let h5;
    	let t17;
    	let button1;
    	let span1;
    	let t19;
    	let div12;
    	let form;
    	let div7;
    	let div6;
    	let label0;
    	let t21;
    	let input0;
    	let t22;
    	let div9;
    	let div8;
    	let label1;
    	let t24;
    	let input1;
    	let t25;
    	let div11;
    	let div10;
    	let label2;
    	let t27;
    	let input2;
    	let t28;
    	let div13;
    	let button2;
    	let t30;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value = /*serviceGroupObjects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Service Group Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Service Group Objects";
    			t4 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t5 = text("Name  ");
    			span0 = element("span");
    			i = element("i");
    			t6 = space();
    			th1 = element("th");
    			th1.textContent = "Ports";
    			t8 = space();
    			th2 = element("th");
    			th2.textContent = "Description";
    			t10 = space();
    			th3 = element("th");
    			t11 = space();
    			th4 = element("th");
    			t12 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			p = element("p");
    			p.textContent = "Bearbeiten | Löschen";
    			t15 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Add Use-Case";
    			t17 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t19 = space();
    			div12 = element("div");
    			form = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t21 = space();
    			input0 = element("input");
    			t22 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Ports";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Description";
    			t27 = space();
    			input2 = element("input");
    			t28 = space();
    			div13 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t30 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$2, 90, 8, 2297);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$2, 89, 6, 2270);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$2, 92, 6, 2394);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#createSGO");
    			set_style(button0, "margin-top", "9px");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$2, 94, 8, 2480);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "text-align-last", "right");
    			add_location(div2, file$2, 93, 6, 2421);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$2, 88, 4, 2245);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$2, 87, 0, 2210);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$2, 108, 61, 2981);
    			add_location(span0, file$2, 108, 30, 2950);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$2, 108, 8, 2928);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$2, 109, 8, 3035);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$2, 110, 8, 3071);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$2, 111, 8, 3114);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$2, 112, 8, 3146);
    			add_location(tr, file$2, 106, 6, 2848);
    			add_location(thead, file$2, 105, 4, 2833);
    			add_location(tbody, file$2, 115, 4, 3200);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allUseCases");
    			add_location(table, file$2, 104, 2, 2763);
    			add_location(p, file$2, 131, 2, 3643);
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", "crateUseCase");
    			add_location(h5, file$2, 137, 10, 3955);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$2, 139, 12, 4116);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "close");
    			attr_dev(button1, "data-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$2, 138, 10, 4026);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$2, 136, 8, 3917);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$2, 146, 16, 4344);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$2, 147, 16, 4411);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$2, 145, 14, 4309);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$2, 144, 12, 4271);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$2, 157, 16, 4722);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "tag");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$2, 158, 16, 4797);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$2, 156, 14, 4687);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$2, 155, 12, 4649);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "description");
    			add_location(label2, file$2, 168, 16, 5107);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "description");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$2, 169, 16, 5188);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$2, 167, 14, 5072);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$2, 166, 12, 5034);
    			attr_dev(form, "class", "mb-5");
    			add_location(form, file$2, 143, 10, 4238);
    			attr_dev(div12, "class", "modal-body");
    			add_location(div12, file$2, 142, 8, 4202);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$2, 180, 10, 5509);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			attr_dev(button3, "data-dismiss", "modal");
    			add_location(button3, file$2, 181, 10, 5604);
    			attr_dev(div13, "class", "modal-footer");
    			add_location(div13, file$2, 179, 8, 5471);
    			attr_dev(div14, "class", "modal-content");
    			add_location(div14, file$2, 135, 6, 3880);
    			attr_dev(div15, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div15, "role", "document");
    			add_location(div15, file$2, 134, 4, 3808);
    			attr_dev(div16, "class", "modal fade");
    			attr_dev(div16, "id", "createSGO");
    			attr_dev(div16, "tabindex", "-1");
    			attr_dev(div16, "role", "dialog");
    			attr_dev(div16, "aria-labelledby", "formCreateUseCase");
    			attr_dev(div16, "aria-hidden", "true");
    			add_location(div16, file$2, 133, 2, 3680);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t5);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(tr, t10);
    			append_dev(tr, th3);
    			append_dev(tr, t11);
    			append_dev(tr, th4);
    			append_dev(table, t12);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t13, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			append_dev(div5, h5);
    			append_dev(div5, t17);
    			append_dev(div5, button1);
    			append_dev(button1, span1);
    			append_dev(div14, t19);
    			append_dev(div14, div12);
    			append_dev(div12, form);
    			append_dev(form, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t21);
    			append_dev(div6, input0);
    			set_input_value(input0, /*serviceGroupObject*/ ctx[2].name);
    			append_dev(form, t22);
    			append_dev(form, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t24);
    			append_dev(div8, input1);
    			set_input_value(input1, /*serviceGroupObject*/ ctx[2].port);
    			append_dev(form, t25);
    			append_dev(form, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t27);
    			append_dev(div10, input2);
    			set_input_value(input2, /*serviceGroupObject*/ ctx[2].description);
    			append_dev(div14, t28);
    			append_dev(div14, div13);
    			append_dev(div13, button2);
    			append_dev(div13, t30);
    			append_dev(div13, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						span0,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("name"))) /*sort*/ ctx[1]("name").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(button3, "click", /*createServiceGroupObject*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*serviceGroupObjects*/ 1) {
    				each_value = /*serviceGroupObjects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*serviceGroupObject*/ 4 && input0.value !== /*serviceGroupObject*/ ctx[2].name) {
    				set_input_value(input0, /*serviceGroupObject*/ ctx[2].name);
    			}

    			if (dirty & /*serviceGroupObject*/ 4 && input1.value !== /*serviceGroupObject*/ ctx[2].port) {
    				set_input_value(input1, /*serviceGroupObject*/ ctx[2].port);
    			}

    			if (dirty & /*serviceGroupObject*/ 4 && input2.value !== /*serviceGroupObject*/ ctx[2].description) {
    				set_input_value(input2, /*serviceGroupObject*/ ctx[2].description);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div16);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const api_root$1 = "http://localhost:8080";

    function instance$2($$self, $$props, $$invalidate) {
    	let sort;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Service_Group_Objects', slots, []);
    	let serviceGroupObjects = [];
    	let serviceGroupObject = { name: null, port: [], description: null };

    	function getServiceGroupObjects() {
    		var config = {
    			method: "get",
    			url: api_root$1 + "/service-group-object",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(0, serviceGroupObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Service Group Objects");
    			console.log(error);
    		});
    	}

    	getServiceGroupObjects();

    	function createServiceGroupObject() {
    		var port = serviceGroupObject.port.split(", ");
    		$$invalidate(2, serviceGroupObject.port = port, serviceGroupObject);

    		var config = {
    			method: "post",
    			url: api_root$1 + "/service-group-object",
    			headers: { "Content-Type": "application/json" },
    			data: serviceGroupObject
    		};

    		axios(config).then(function (response) {
    			getServiceGroupObjects();
    		}).catch(function (error) {
    			alert("Could not create Service Group Objects");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Service_Group_Objects> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		serviceGroupObject.name = this.value;
    		$$invalidate(2, serviceGroupObject);
    	}

    	function input1_input_handler() {
    		serviceGroupObject.port = this.value;
    		$$invalidate(2, serviceGroupObject);
    	}

    	function input2_input_handler() {
    		serviceGroupObject.description = this.value;
    		$$invalidate(2, serviceGroupObject);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		api_root: api_root$1,
    		serviceGroupObjects,
    		serviceGroupObject,
    		getServiceGroupObjects,
    		createServiceGroupObject,
    		sortBy,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('serviceGroupObjects' in $$props) $$invalidate(0, serviceGroupObjects = $$props.serviceGroupObjects);
    		if ('serviceGroupObject' in $$props) $$invalidate(2, serviceGroupObject = $$props.serviceGroupObject);
    		if ('sortBy' in $$props) $$invalidate(4, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, serviceGroupObjects*/ 17) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(4, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(4, sortBy.col = column, sortBy);
    					$$invalidate(4, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(0, serviceGroupObjects = serviceGroupObjects.sort(sort));
    			});
    		}
    	};

    	return [
    		serviceGroupObjects,
    		sort,
    		serviceGroupObject,
    		createServiceGroupObject,
    		sortBy,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Service_Group_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Service_Group_Objects",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Use-Cases.svelte generated by Svelte v3.53.1 */

    const { console: console_1 } = globals;
    const file$1 = "src\\pages\\Use-Cases.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (123:14) {#each useCase.tags as tags}
    function create_each_block_1(ctx) {
    	let t0_value = /*tags*/ ctx[11] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(";\r\n            ");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*useCases*/ 1 && t0_value !== (t0_value = /*tags*/ ctx[11] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(123:14) {#each useCase.tags as tags}",
    		ctx
    	});

    	return block;
    }

    // (119:6) {#each useCases as useCase}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*useCase*/ ctx[2].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*useCase*/ ctx[2].description + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4;
    	let td3;
    	let t6;
    	let td4;
    	let t8;
    	let each_value_1 = /*useCase*/ ctx[2].tags;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			td3 = element("td");
    			td3.textContent = "edit";
    			t6 = space();
    			td4 = element("td");
    			td4.textContent = "delete";
    			t8 = space();
    			add_location(td0, file$1, 120, 10, 3153);
    			add_location(td1, file$1, 121, 10, 3188);
    			add_location(td2, file$1, 122, 10, 3230);
    			add_location(td3, file$1, 125, 10, 3321);
    			add_location(td4, file$1, 126, 10, 3346);
    			add_location(tr, file$1, 119, 8, 3137);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td2, null);
    			}

    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*useCases*/ 1 && t0_value !== (t0_value = /*useCase*/ ctx[2].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*useCases*/ 1 && t2_value !== (t2_value = /*useCase*/ ctx[2].description + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*useCases*/ 1) {
    				each_value_1 = /*useCase*/ ctx[2].tags;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(119:6) {#each useCases as useCase}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button0;
    	let t4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t5;
    	let span0;
    	let i;
    	let t6;
    	let th1;
    	let t8;
    	let th2;
    	let t10;
    	let th3;
    	let t11;
    	let th4;
    	let t12;
    	let tbody;
    	let t13;
    	let p;
    	let t15;
    	let div16;
    	let div15;
    	let div14;
    	let div5;
    	let h5;
    	let t17;
    	let button1;
    	let span1;
    	let t19;
    	let div12;
    	let form;
    	let div7;
    	let div6;
    	let label0;
    	let t21;
    	let input0;
    	let t22;
    	let div9;
    	let div8;
    	let label1;
    	let t24;
    	let input1;
    	let t25;
    	let div11;
    	let div10;
    	let label2;
    	let t27;
    	let input2;
    	let t28;
    	let div13;
    	let button2;
    	let t30;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value = /*useCases*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Use Cases";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Use Case";
    			t4 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t5 = text("Name  ");
    			span0 = element("span");
    			i = element("i");
    			t6 = space();
    			th1 = element("th");
    			th1.textContent = "Description";
    			t8 = space();
    			th2 = element("th");
    			th2.textContent = "Tags (Standort/Bereich)";
    			t10 = space();
    			th3 = element("th");
    			t11 = space();
    			th4 = element("th");
    			t12 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			p = element("p");
    			p.textContent = "Bearbeiten | Löschen";
    			t15 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Add Use-Case";
    			t17 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t19 = space();
    			div12 = element("div");
    			form = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t21 = space();
    			input0 = element("input");
    			t22 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Description";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Tags (Standort/Organisation)";
    			t27 = space();
    			input2 = element("input");
    			t28 = space();
    			div13 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t30 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$1, 92, 8, 2191);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$1, 91, 6, 2164);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$1, 94, 6, 2276);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#crateUC");
    			set_style(button0, "margin-top", "9px");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$1, 96, 8, 2362);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "text-align-last", "right");
    			add_location(div2, file$1, 95, 6, 2303);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$1, 90, 4, 2139);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$1, 89, 0, 2104);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$1, 110, 61, 2848);
    			add_location(span0, file$1, 110, 30, 2817);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$1, 110, 8, 2795);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$1, 111, 8, 2902);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$1, 112, 8, 2945);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$1, 113, 8, 2999);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$1, 114, 8, 3031);
    			add_location(tr, file$1, 108, 6, 2715);
    			add_location(thead, file$1, 107, 4, 2700);
    			add_location(tbody, file$1, 117, 4, 3085);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allUseCases");
    			add_location(table, file$1, 106, 2, 2630);
    			add_location(p, file$1, 131, 2, 3421);
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", "crateUseCase");
    			add_location(h5, file$1, 137, 10, 3731);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$1, 139, 12, 3892);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "close");
    			attr_dev(button1, "data-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$1, 138, 10, 3802);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$1, 136, 8, 3693);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$1, 146, 16, 4120);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$1, 147, 16, 4187);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$1, 145, 14, 4085);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$1, 144, 12, 4047);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$1, 157, 16, 4487);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "description");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$1, 158, 16, 4568);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$1, 156, 14, 4452);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$1, 155, 12, 4414);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "description");
    			add_location(label2, file$1, 168, 16, 4882);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "tag");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$1, 169, 16, 4981);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$1, 167, 14, 4847);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$1, 166, 12, 4809);
    			attr_dev(form, "class", "mb-5");
    			add_location(form, file$1, 143, 10, 4014);
    			attr_dev(div12, "class", "modal-body");
    			add_location(div12, file$1, 142, 8, 3978);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$1, 180, 10, 5276);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			add_location(button3, file$1, 181, 10, 5371);
    			attr_dev(div13, "class", "modal-footer");
    			add_location(div13, file$1, 179, 8, 5238);
    			attr_dev(div14, "class", "modal-content");
    			add_location(div14, file$1, 135, 6, 3656);
    			attr_dev(div15, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div15, "role", "document");
    			add_location(div15, file$1, 134, 4, 3584);
    			attr_dev(div16, "class", "modal fade");
    			attr_dev(div16, "id", "crateUC");
    			attr_dev(div16, "tabindex", "-1");
    			attr_dev(div16, "role", "dialog");
    			attr_dev(div16, "aria-labelledby", "formCreateUseCase");
    			attr_dev(div16, "aria-hidden", "true");
    			add_location(div16, file$1, 133, 2, 3458);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t5);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(tr, t10);
    			append_dev(tr, th3);
    			append_dev(tr, t11);
    			append_dev(tr, th4);
    			append_dev(table, t12);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t13, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			append_dev(div5, h5);
    			append_dev(div5, t17);
    			append_dev(div5, button1);
    			append_dev(button1, span1);
    			append_dev(div14, t19);
    			append_dev(div14, div12);
    			append_dev(div12, form);
    			append_dev(form, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t21);
    			append_dev(div6, input0);
    			set_input_value(input0, /*useCase*/ ctx[2].name);
    			append_dev(form, t22);
    			append_dev(form, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t24);
    			append_dev(div8, input1);
    			set_input_value(input1, /*useCase*/ ctx[2].description);
    			append_dev(form, t25);
    			append_dev(form, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t27);
    			append_dev(div10, input2);
    			set_input_value(input2, /*useCase*/ ctx[2].tags);
    			append_dev(div14, t28);
    			append_dev(div14, div13);
    			append_dev(div13, button2);
    			append_dev(div13, t30);
    			append_dev(div13, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						span0,
    						"click",
    						function () {
    							if (is_function(/*sort*/ ctx[1]("name"))) /*sort*/ ctx[1]("name").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(button3, "click", /*createUseCase*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*useCases*/ 1) {
    				each_value = /*useCases*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*useCase*/ 4 && input0.value !== /*useCase*/ ctx[2].name) {
    				set_input_value(input0, /*useCase*/ ctx[2].name);
    			}

    			if (dirty & /*useCase*/ 4 && input1.value !== /*useCase*/ ctx[2].description) {
    				set_input_value(input1, /*useCase*/ ctx[2].description);
    			}

    			if (dirty & /*useCase*/ 4 && input2.value !== /*useCase*/ ctx[2].tags) {
    				set_input_value(input2, /*useCase*/ ctx[2].tags);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div16);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const api_root = "http://localhost:8080";

    function instance$1($$self, $$props, $$invalidate) {
    	let sort;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Use_Cases', slots, []);
    	let useCases = [];
    	let useCase = { name: null, description: null, tags: [] };

    	function getUseCases() {
    		var config = {
    			method: "get",
    			url: api_root + "/use-case",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(0, useCases = response.data);
    		}).catch(function (error) {
    			alert("Could not get Use Cases");
    			console.log(error);
    		});
    	}

    	getUseCases();

    	function createUseCase() {
    		var tags = useCase.tags.split(", ");
    		$$invalidate(2, useCase.tags = tags, useCase);

    		var config = {
    			method: "post",
    			url: api_root + "/use-case",
    			headers: { "Content-Type": "application/json" },
    			data: useCase
    		};

    		axios(config).then(function (response) {
    			alert("Use Case created");
    			getUseCases();
    		}).catch(function (error) {
    			alert("Could not create Use Case");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Use_Cases> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		useCase.name = this.value;
    		$$invalidate(2, useCase);
    	}

    	function input1_input_handler() {
    		useCase.description = this.value;
    		$$invalidate(2, useCase);
    	}

    	function input2_input_handler() {
    		useCase.tags = this.value;
    		$$invalidate(2, useCase);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		each,
    		api_root,
    		useCases,
    		useCase,
    		getUseCases,
    		createUseCase,
    		sortBy,
    		sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('useCases' in $$props) $$invalidate(0, useCases = $$props.useCases);
    		if ('useCase' in $$props) $$invalidate(2, useCase = $$props.useCase);
    		if ('sortBy' in $$props) $$invalidate(4, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, useCases*/ 17) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(4, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(4, sortBy.col = column, sortBy);
    					$$invalidate(4, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(0, useCases = useCases.sort(sort));
    			});
    		}
    	};

    	return [
    		useCases,
    		sort,
    		useCase,
    		createUseCase,
    		sortBy,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Use_Cases extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Use_Cases",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var routes = {
        '/': Home,
        '/home': Home,
        '/firewall-Rules': Firewall_Rules,
        '/contexts': Contexts,
        '/network-Objects' : Network_Objects,
        '/network-Group-Objects': Network_Group_Objects,
        '/host-Objects': Host_Objects,
        '/host-Group-Objects': Host_Group_Objects,
        '/service-Group-Objects': Service_Group_Objects,
        '/use-cases': Use_Cases,
        
        
    };

    /* src\App.svelte generated by Svelte v3.53.1 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div5;
    	let div4;
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h1;
    	let center;
    	let t2;
    	let div2;
    	let t3;
    	let div8;
    	let nav;
    	let button;
    	let span;
    	let t4;
    	let div6;
    	let ul;
    	let li0;
    	let a0;
    	let t6;
    	let li1;
    	let a1;
    	let t8;
    	let li2;
    	let a2;
    	let t10;
    	let li3;
    	let a3;
    	let t12;
    	let li4;
    	let a4;
    	let t14;
    	let li5;
    	let a5;
    	let t16;
    	let li6;
    	let a6;
    	let t18;
    	let li7;
    	let a7;
    	let t20;
    	let li8;
    	let a8;
    	let t22;
    	let div7;
    	let router;
    	let current;
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			center = element("center");
    			center.textContent = "Firewall Documentation";
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div8 = element("div");
    			nav = element("nav");
    			button = element("button");
    			span = element("span");
    			t4 = space();
    			div6 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t6 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Firewall-Rules";
    			t8 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Contexts";
    			t10 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Network-Objects";
    			t12 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Network-Group-Objects";
    			t14 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Host-Objects";
    			t16 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Host-Group-Objects";
    			t18 = space();
    			li7 = element("li");
    			a7 = element("a");
    			a7.textContent = "Service-Group-Objects";
    			t20 = space();
    			li8 = element("li");
    			a8 = element("a");
    			a8.textContent = "Use-Cases";
    			t22 = space();
    			div7 = element("div");
    			create_component(router.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "https://www.buelach.ch/fileadmin/cd/Images/logo_stadtbuelach.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Stadt Bülach Logo");
    			set_style(img, "height", "50px");
    			set_style(img, "width", "231px");
    			add_location(img, file, 9, 21, 305);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file, 9, 4, 288);
    			add_location(center, file, 14, 52, 516);
    			set_style(h1, "font-weight", "bold");
    			add_location(h1, file, 14, 21, 485);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file, 14, 4, 468);
    			attr_dev(div2, "class", "col");
    			add_location(div2, file, 15, 1, 571);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file, 8, 0, 265);
    			set_style(div4, "padding-top", "15px");
    			set_style(div4, "padding-bottom", "15px");
    			add_location(div4, file, 7, 0, 209);
    			attr_dev(div5, "class", "container-fluid");
    			set_style(div5, "background-color", "#ececee");
    			add_location(div5, file, 6, 0, 143);
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file, 34, 6, 1021);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbarNav");
    			attr_dev(button, "aria-controls", "navbarNav");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file, 25, 4, 780);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "#/home");
    			add_location(a0, file, 39, 3, 1206);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file, 38, 8, 1180);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "aria-current", "page");
    			attr_dev(a1, "href", "#/firewall-rules");
    			add_location(a1, file, 42, 10, 1300);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file, 41, 6, 1267);
    			attr_dev(a2, "class", "nav-link");
    			attr_dev(a2, "href", "#/contexts");
    			add_location(a2, file, 47, 10, 1466);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file, 46, 8, 1433);
    			attr_dev(a3, "class", "nav-link");
    			attr_dev(a3, "href", "#/network-Objects");
    			add_location(a3, file, 51, 10, 1578);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file, 50, 8, 1545);
    			attr_dev(a4, "class", "nav-link");
    			attr_dev(a4, "href", "#/network-Group-Objects");
    			add_location(a4, file, 54, 10, 1690);
    			attr_dev(li4, "class", "nav-item");
    			add_location(li4, file, 53, 4, 1657);
    			attr_dev(a5, "class", "nav-link");
    			attr_dev(a5, "href", "#/host-Objects");
    			add_location(a5, file, 58, 10, 1838);
    			attr_dev(li5, "class", "nav-item");
    			add_location(li5, file, 57, 8, 1805);
    			attr_dev(a6, "class", "nav-link");
    			attr_dev(a6, "href", "#/host-Group-Objects");
    			add_location(a6, file, 61, 10, 1954);
    			attr_dev(li6, "class", "nav-item");
    			add_location(li6, file, 60, 8, 1921);
    			attr_dev(a7, "class", "nav-link");
    			attr_dev(a7, "href", "#/service-Group-Objects");
    			add_location(a7, file, 64, 10, 2082);
    			attr_dev(li7, "class", "nav-item");
    			add_location(li7, file, 63, 8, 2049);
    			attr_dev(a8, "class", "nav-link");
    			attr_dev(a8, "href", "#/use-cases");
    			add_location(a8, file, 67, 10, 2216);
    			attr_dev(li8, "class", "nav-item");
    			add_location(li8, file, 66, 8, 2183);
    			attr_dev(ul, "class", "navbar-nav mx-auto");
    			add_location(ul, file, 37, 6, 1139);
    			attr_dev(div6, "class", "collapse navbar-collapse");
    			attr_dev(div6, "id", "navbarNav");
    			add_location(div6, file, 36, 4, 1078);
    			attr_dev(nav, "class", "navbar navbar-expand-lg");
    			set_style(nav, "background-color", "#969FAA");
    			set_style(nav, "color", "black");
    			set_style(nav, "height", "38pt");
    			add_location(nav, file, 21, 2, 660);
    			attr_dev(div7, "class", "container");
    			add_location(div7, file, 73, 2, 2324);
    			attr_dev(div8, "id", "app");
    			add_location(div8, file, 20, 0, 642);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, h1);
    			append_dev(h1, center);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, nav);
    			append_dev(nav, button);
    			append_dev(button, span);
    			append_dev(nav, t4);
    			append_dev(nav, div6);
    			append_dev(div6, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t6);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t8);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t10);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t12);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t14);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(ul, t16);
    			append_dev(ul, li6);
    			append_dev(li6, a6);
    			append_dev(ul, t18);
    			append_dev(ul, li7);
    			append_dev(li7, a7);
    			append_dev(ul, t20);
    			append_dev(ul, li8);
    			append_dev(li8, a8);
    			append_dev(div8, t22);
    			append_dev(div8, div7);
    			mount_component(router, div7, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div8);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router, Home, routes });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
