
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
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

    const { Error: Error_1, Object: Object_1, console: console_1$a } = globals;

    // (267:0) {:else}
    function create_else_block$9(ctx) {
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
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(267:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:0) {#if componentParams}
    function create_if_block$a(ctx) {
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
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(260:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$9];
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
    		id: create_fragment$c.name,
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

    function instance$c($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<Router> was created with unknown prop '${key}'`);
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

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$c.name
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

    /* src\lib\piechart.svelte generated by Svelte v3.53.1 */

    const { console: console_1$9 } = globals;
    const file$b = "src\\lib\\piechart.svelte";

    function create_fragment$b(ctx) {
    	let svg;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			attr_dev(svg, "id", "piechart");
    			set_style(svg, "height", "500px");
    			set_style(svg, "width", "400px");
    			add_location(svg, file$b, 114, 0, 2628);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Piechart', slots, []);
    	const api_root = window.location.origin + "/api";
    	let fwRulesByType = [];

    	function getFirewallRulesByType() {
    		var config = {
    			method: "get",
    			url: api_root + "/firewall-rule/byFwType",
    			headers: {}
    		};

    		axios(config).then(function (response) {
    			$$invalidate(0, fwRulesByType = response.data);
    		}).catch(function (error) {
    			alert("Could not get Firewall Rules by Type");
    			console.log(error);
    		});
    	}

    	getFirewallRulesByType();

    	function getPie() {
    		var width = 400, height = 500;
    		var colors = d3.scaleOrdinal(d3.schemeDark2);
    		var svg = d3.select("#piechart").append("svg").attr("width", width).attr("height", height).style("background", "white");
    		var details = fwRulesByType;

    		var data = d3.pie().sort(null).value(function (d) {
    			return d.count;
    		})(details);

    		console.log(data);
    		var segments = d3.arc().innerRadius(0).outerRadius(200).padRadius(50);
    		var sections = svg.append("g").attr("transform", "translate(200, 200)").selectAll("path").data(data);

    		sections.enter().append("path").attr("d", segments).attr("fill", function (d) {
    			return colors(d.data.count);
    		});

    		var content = d3.select("g").selectAll("text").data(data);

    		content.enter().append("text").classed("inside", true).each(function (d) {
    			var center = segments.centroid(d);
    			d3.select(this).attr("x", center[0]).attr("y", center[1]).text(d.data.count);
    		});

    		var legends = svg.append("g").attr("transform", "translate(125, 385)").selectAll(".legends").data(data);

    		var legend = legends.enter().append("g").classed("legends", true).attr("transform", function (d, i) {
    			return "translate(0," + (i + 1) * 30 + ")";
    		});

    		legend.append("rect").attr("width", 20).attr("height", 20).attr("fill", function (d) {
    			return colors(d.data.count);
    		});

    		legend.append("text").text(function (d) {
    			return d.data.name;
    		}).attr("fill", function (d) {
    			return colors(d.data.count);
    		}).attr("x", 30).attr("y", 20);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<Piechart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		axios,
    		api_root,
    		fwRulesByType,
    		getFirewallRulesByType,
    		getPie
    	});

    	$$self.$inject_state = $$props => {
    		if ('fwRulesByType' in $$props) $$invalidate(0, fwRulesByType = $$props.fwRulesByType);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*fwRulesByType*/ 1) {
    			{
    				if (fwRulesByType.length) {
    					getPie();
    				}
    			}
    		}
    	};

    	return [fwRulesByType];
    }

    class Piechart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Piechart",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\pages\Home.svelte generated by Svelte v3.53.1 */
    const file$a = "src\\pages\\Home.svelte";

    function create_fragment$a(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let center;
    	let h2;
    	let strong;
    	let t2;
    	let piechart;
    	let current;
    	piechart = new Piechart({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			center = element("center");
    			h2 = element("h2");
    			strong = element("strong");
    			strong.textContent = "Rules count on each Firewall System";
    			t2 = space();
    			create_component(piechart.$$.fragment);
    			set_style(div0, "margin-left", "-52px");
    			set_style(div0, "margin-right", "-52px");
    			add_location(div0, file$a, 6, 0, 77);
    			add_location(strong, file$a, 9, 34, 188);
    			set_style(h2, "margin-top", "10px");
    			add_location(h2, file$a, 9, 4, 158);
    			add_location(center, file$a, 8, 2, 144);
    			add_location(div1, file$a, 7, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, center);
    			append_dev(center, h2);
    			append_dev(h2, strong);
    			append_dev(center, t2);
    			mount_component(piechart, center, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(piechart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(piechart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(piechart);
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

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Piechart });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const isAuthenticated = writable(false);
    const user = writable({});
    const jwt_token = writable([]);

    /* src\pages\Firewall-Rules.svelte generated by Svelte v3.53.1 */

    const { console: console_1$8 } = globals;
    const file$9 = "src\\pages\\Firewall-Rules.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[63] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[66] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[72] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[75] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[78] = list[i];
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[72] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[75] = list[i];
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[78] = list[i];
    	return child_ctx;
    }

    function get_each_context_10(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[89] = list[i];
    	return child_ctx;
    }

    function get_each_context_11(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[92] = list[i];
    	return child_ctx;
    }

    function get_each_context_12(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[63] = list[i];
    	return child_ctx;
    }

    function get_each_context_13(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[66] = list[i];
    	return child_ctx;
    }

    function get_each_context_14(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context_15(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[72] = list[i];
    	return child_ctx;
    }

    function get_each_context_16(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[75] = list[i];
    	return child_ctx;
    }

    function get_each_context_17(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[78] = list[i];
    	return child_ctx;
    }

    function get_each_context_18(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context_19(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[72] = list[i];
    	return child_ctx;
    }

    function get_each_context_20(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[75] = list[i];
    	return child_ctx;
    }

    function get_each_context_21(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[78] = list[i];
    	return child_ctx;
    }

    function get_each_context_22(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[89] = list[i];
    	return child_ctx;
    }

    function get_each_context_23(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[92] = list[i];
    	return child_ctx;
    }

    function get_each_context_24(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[119] = list[i];
    	return child_ctx;
    }

    function get_each_context_25(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[122] = list[i];
    	return child_ctx;
    }

    function get_each_context_26(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[125] = list[i];
    	return child_ctx;
    }

    function get_each_context_27(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[125] = list[i];
    	return child_ctx;
    }

    function get_each_context_28(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[125] = list[i];
    	return child_ctx;
    }

    function get_each_context_29(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[125] = list[i];
    	return child_ctx;
    }

    // (465:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_17(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Firewall Rule";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#createFWR");
    			set_style(button, "margin-top", "9px");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			add_location(button, file$9, 466, 10, 12114);
    			attr_dev(div, "class", "col");
    			set_style(div, "text-align-last", "right");
    			add_location(div, file$9, 465, 8, 12053);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(465:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (537:12) {#if fwr.sHo}
    function create_if_block_16(ctx) {
    	let li0;
    	let button;
    	let t0_value = /*fwr*/ ctx[119].sHo.name + "";
    	let t0;
    	let button_data_bs_target_value;
    	let t1;
    	let div;
    	let li1;
    	let t2_value = /*fwr*/ ctx[119].sHo.ip + "";
    	let t2;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			li1 = element("li");
    			t2 = text(t2_value);
    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", button_data_bs_target_value = "#source" + /*fwr*/ ctx[119].sHo.id + /*fwr*/ ctx[119].fwId);
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-controls", "source");
    			add_location(button, file$9, 538, 16, 14451);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$9, 537, 14, 14405);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$9, 550, 16, 14935);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "source" + /*fwr*/ ctx[119].sHo.id + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 549, 14, 14861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, li1);
    			append_dev(li1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].sHo.name + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#source" + /*fwr*/ ctx[119].sHo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button, "data-bs-target", button_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[119].sHo.ip + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "source" + /*fwr*/ ctx[119].sHo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(537:12) {#if fwr.sHo}",
    		ctx
    	});

    	return block;
    }

    // (557:12) {#if fwr.sHgoWithHo}
    function create_if_block_15(ctx) {
    	let li;
    	let button;
    	let t0_value = /*fwr*/ ctx[119].sHgoWithHo.hgoName + "";
    	let t0;
    	let button_data_bs_target_value;
    	let t1;
    	let div;
    	let div_id_value;
    	let each_value_29 = /*fwr*/ ctx[119].sHgoWithHo.members;
    	validate_each_argument(each_value_29);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_29.length; i += 1) {
    		each_blocks[i] = create_each_block_29(get_each_context_29(ctx, each_value_29, i));
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", button_data_bs_target_value = "#source" + /*fwr*/ ctx[119].sHgoWithHo.hgoId + /*fwr*/ ctx[119].fwId);
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-controls", "source");
    			add_location(button, file$9, 558, 16, 15185);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$9, 557, 14, 15139);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "source" + /*fwr*/ ctx[119].sHgoWithHo.hgoId + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 569, 14, 15615);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].sHgoWithHo.hgoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#source" + /*fwr*/ ctx[119].sHgoWithHo.hgoId + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button, "data-bs-target", button_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1) {
    				each_value_29 = /*fwr*/ ctx[119].sHgoWithHo.members;
    				validate_each_argument(each_value_29);
    				let i;

    				for (i = 0; i < each_value_29.length; i += 1) {
    					const child_ctx = get_each_context_29(ctx, each_value_29, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_29(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_29.length;
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "source" + /*fwr*/ ctx[119].sHgoWithHo.hgoId + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(557:12) {#if fwr.sHgoWithHo}",
    		ctx
    	});

    	return block;
    }

    // (571:16) {#each fwr.sHgoWithHo.members as m}
    function create_each_block_29(ctx) {
    	let li0;
    	let t0_value = /*m*/ ctx[125].name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*m*/ ctx[125].ip + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(li0, "class", "list-group-item");
    			set_style(li0, "font-style", "italic");
    			add_location(li0, file$9, 571, 18, 15754);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$9, 574, 18, 15885);
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
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*m*/ ctx[125].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*m*/ ctx[125].ip + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_29.name,
    		type: "each",
    		source: "(571:16) {#each fwr.sHgoWithHo.members as m}",
    		ctx
    	});

    	return block;
    }

    // (582:12) {#if fwr.sNo}
    function create_if_block_14(ctx) {
    	let li0;
    	let button;
    	let t0_value = /*fwr*/ ctx[119].sNo.name + "";
    	let t0;
    	let button_data_bs_target_value;
    	let t1;
    	let div;
    	let li1;
    	let t2_value = /*fwr*/ ctx[119].sNo.ip + "";
    	let t2;
    	let t3_value = /*fwr*/ ctx[119].sNo.subnet + "";
    	let t3;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", button_data_bs_target_value = "#source" + /*fwr*/ ctx[119].sNo.id + /*fwr*/ ctx[119].fwId);
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-controls", "source");
    			add_location(button, file$9, 583, 16, 16151);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$9, 582, 14, 16105);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$9, 595, 16, 16635);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "source" + /*fwr*/ ctx[119].sNo.id + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 594, 14, 16561);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, li1);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].sNo.name + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#source" + /*fwr*/ ctx[119].sNo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button, "data-bs-target", button_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[119].sNo.ip + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t3_value !== (t3_value = /*fwr*/ ctx[119].sNo.subnet + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "source" + /*fwr*/ ctx[119].sNo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(582:12) {#if fwr.sNo}",
    		ctx
    	});

    	return block;
    }

    // (602:12) {#if fwr.sNgoWithNo}
    function create_if_block_13(ctx) {
    	let li;
    	let button;
    	let t0_value = /*fwr*/ ctx[119].sNgoWithNo.ngoName + "";
    	let t0;
    	let button_data_bs_target_value;
    	let t1;
    	let div;
    	let div_id_value;
    	let each_value_28 = /*fwr*/ ctx[119].sNgoWithNo.members;
    	validate_each_argument(each_value_28);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_28.length; i += 1) {
    		each_blocks[i] = create_each_block_28(get_each_context_28(ctx, each_value_28, i));
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", button_data_bs_target_value = "#source" + /*fwr*/ ctx[119].sNgoWithNo.ngoId + /*fwr*/ ctx[119].fwId);
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-controls", "source");
    			add_location(button, file$9, 603, 16, 16901);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$9, 602, 14, 16855);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "source" + /*fwr*/ ctx[119].sNgoWithNo.ngoId + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 614, 14, 17331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].sNgoWithNo.ngoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#source" + /*fwr*/ ctx[119].sNgoWithNo.ngoId + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button, "data-bs-target", button_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1) {
    				each_value_28 = /*fwr*/ ctx[119].sNgoWithNo.members;
    				validate_each_argument(each_value_28);
    				let i;

    				for (i = 0; i < each_value_28.length; i += 1) {
    					const child_ctx = get_each_context_28(ctx, each_value_28, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_28(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_28.length;
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "source" + /*fwr*/ ctx[119].sNgoWithNo.ngoId + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(602:12) {#if fwr.sNgoWithNo}",
    		ctx
    	});

    	return block;
    }

    // (616:16) {#each fwr.sNgoWithNo.members as m}
    function create_each_block_28(ctx) {
    	let li0;
    	let t0_value = /*m*/ ctx[125].name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*m*/ ctx[125].ip + "";
    	let t2;
    	let t3_value = /*m*/ ctx[125].subnet + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(li0, "class", "list-group-item");
    			set_style(li0, "font-style", "italic");
    			add_location(li0, file$9, 616, 18, 17470);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$9, 619, 18, 17601);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    			append_dev(li1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*m*/ ctx[125].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*m*/ ctx[125].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t3_value !== (t3_value = /*m*/ ctx[125].subnet + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_28.name,
    		type: "each",
    		source: "(616:16) {#each fwr.sNgoWithNo.members as m}",
    		ctx
    	});

    	return block;
    }

    // (630:12) {#if fwr.dHo}
    function create_if_block_12(ctx) {
    	let li0;
    	let button;
    	let t0_value = /*fwr*/ ctx[119].dHo.name + "";
    	let t0;
    	let button_data_bs_target_value;
    	let t1;
    	let div;
    	let li1;
    	let t2_value = /*fwr*/ ctx[119].dHo.ip + "";
    	let t2;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			li1 = element("li");
    			t2 = text(t2_value);
    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", button_data_bs_target_value = "#destination" + /*fwr*/ ctx[119].dHo.id + /*fwr*/ ctx[119].fwId);
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-controls", "destination");
    			add_location(button, file$9, 631, 16, 18000);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$9, 630, 14, 17954);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$9, 643, 16, 18499);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "destination" + /*fwr*/ ctx[119].dHo.id + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 642, 14, 18420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, li1);
    			append_dev(li1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].dHo.name + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#destination" + /*fwr*/ ctx[119].dHo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button, "data-bs-target", button_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[119].dHo.ip + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "destination" + /*fwr*/ ctx[119].dHo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(630:12) {#if fwr.dHo}",
    		ctx
    	});

    	return block;
    }

    // (650:12) {#if fwr.dHgoWithHo}
    function create_if_block_11(ctx) {
    	let li;
    	let button;
    	let t0_value = /*fwr*/ ctx[119].dHgoWithHo.hgoName + "";
    	let t0;
    	let button_data_bs_target_value;
    	let t1;
    	let div;
    	let div_id_value;
    	let each_value_27 = /*fwr*/ ctx[119].dHgoWithHo.members;
    	validate_each_argument(each_value_27);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_27.length; i += 1) {
    		each_blocks[i] = create_each_block_27(get_each_context_27(ctx, each_value_27, i));
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", button_data_bs_target_value = "#destination" + /*fwr*/ ctx[119].dHgoWithHo.hgoId + /*fwr*/ ctx[119].fwId);
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-controls", "destination");
    			add_location(button, file$9, 651, 16, 18749);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$9, 650, 14, 18703);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "destination" + /*fwr*/ ctx[119].dHgoWithHo.hgoId + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 662, 14, 19189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].dHgoWithHo.hgoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#destination" + /*fwr*/ ctx[119].dHgoWithHo.hgoId + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button, "data-bs-target", button_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1) {
    				each_value_27 = /*fwr*/ ctx[119].dHgoWithHo.members;
    				validate_each_argument(each_value_27);
    				let i;

    				for (i = 0; i < each_value_27.length; i += 1) {
    					const child_ctx = get_each_context_27(ctx, each_value_27, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_27(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_27.length;
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "destination" + /*fwr*/ ctx[119].dHgoWithHo.hgoId + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(650:12) {#if fwr.dHgoWithHo}",
    		ctx
    	});

    	return block;
    }

    // (667:16) {#each fwr.dHgoWithHo.members as m}
    function create_each_block_27(ctx) {
    	let li0;
    	let t0_value = /*m*/ ctx[125].name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*m*/ ctx[125].ip + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(li0, "class", "list-group-item");
    			set_style(li0, "font-style", "italic");
    			add_location(li0, file$9, 667, 18, 19383);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$9, 670, 18, 19514);
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
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*m*/ ctx[125].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*m*/ ctx[125].ip + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_27.name,
    		type: "each",
    		source: "(667:16) {#each fwr.dHgoWithHo.members as m}",
    		ctx
    	});

    	return block;
    }

    // (678:12) {#if fwr.dNo}
    function create_if_block_10(ctx) {
    	let li0;
    	let button;
    	let t0_value = /*fwr*/ ctx[119].dNo.name + "";
    	let t0;
    	let button_data_bs_target_value;
    	let t1;
    	let div;
    	let li1;
    	let t2_value = /*fwr*/ ctx[119].dNo.ip + "";
    	let t2;
    	let t3_value = /*fwr*/ ctx[119].dNo.subnet + "";
    	let t3;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", button_data_bs_target_value = "#destination" + /*fwr*/ ctx[119].dNo.id + /*fwr*/ ctx[119].fwId);
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-controls", "destination");
    			add_location(button, file$9, 679, 16, 19780);
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$9, 678, 14, 19734);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$9, 691, 16, 20279);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "destination" + /*fwr*/ ctx[119].dNo.id + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 690, 14, 20200);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, li1);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].dNo.name + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#destination" + /*fwr*/ ctx[119].dNo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button, "data-bs-target", button_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[119].dNo.ip + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t3_value !== (t3_value = /*fwr*/ ctx[119].dNo.subnet + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "destination" + /*fwr*/ ctx[119].dNo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(678:12) {#if fwr.dNo}",
    		ctx
    	});

    	return block;
    }

    // (698:12) {#if fwr.dNgoWithNo}
    function create_if_block_9$1(ctx) {
    	let li;
    	let button;
    	let t0_value = /*fwr*/ ctx[119].dNgoWithNo.ngoName + "";
    	let t0;
    	let button_data_bs_target_value;
    	let t1;
    	let div;
    	let div_id_value;
    	let each_value_26 = /*fwr*/ ctx[119].dNgoWithNo.members;
    	validate_each_argument(each_value_26);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_26.length; i += 1) {
    		each_blocks[i] = create_each_block_26(get_each_context_26(ctx, each_value_26, i));
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", button_data_bs_target_value = "#destination" + /*fwr*/ ctx[119].dNgoWithNo.ngoId + /*fwr*/ ctx[119].fwId);
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-controls", "destination");
    			add_location(button, file$9, 699, 16, 20545);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$9, 698, 14, 20499);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "destination" + /*fwr*/ ctx[119].dNgoWithNo.ngoId + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 710, 14, 20985);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].dNgoWithNo.ngoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button_data_bs_target_value !== (button_data_bs_target_value = "#destination" + /*fwr*/ ctx[119].dNgoWithNo.ngoId + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button, "data-bs-target", button_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1) {
    				each_value_26 = /*fwr*/ ctx[119].dNgoWithNo.members;
    				validate_each_argument(each_value_26);
    				let i;

    				for (i = 0; i < each_value_26.length; i += 1) {
    					const child_ctx = get_each_context_26(ctx, each_value_26, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_26(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_26.length;
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "destination" + /*fwr*/ ctx[119].dNgoWithNo.ngoId + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(698:12) {#if fwr.dNgoWithNo}",
    		ctx
    	});

    	return block;
    }

    // (715:16) {#each fwr.dNgoWithNo.members as m}
    function create_each_block_26(ctx) {
    	let li0;
    	let t0_value = /*m*/ ctx[125].name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*m*/ ctx[125].ip + "";
    	let t2;
    	let t3_value = /*m*/ ctx[125].subnet + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(li0, "class", "list-group-item");
    			set_style(li0, "font-style", "italic");
    			add_location(li0, file$9, 715, 18, 21179);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$9, 718, 18, 21310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    			append_dev(li1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*m*/ ctx[125].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*m*/ ctx[125].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t3_value !== (t3_value = /*m*/ ctx[125].subnet + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_26.name,
    		type: "each",
    		source: "(715:16) {#each fwr.dNgoWithNo.members as m}",
    		ctx
    	});

    	return block;
    }

    // (742:14) {#each fwr.sgo.port as port}
    function create_each_block_25(ctx) {
    	let li;
    	let t0_value = /*port*/ ctx[122] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "list-group-item");
    			set_style(li, "font-style", "italic");
    			add_location(li, file$9, 742, 16, 22190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*port*/ ctx[122] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_25.name,
    		type: "each",
    		source: "(742:14) {#each fwr.sgo.port as port}",
    		ctx
    	});

    	return block;
    }

    // (770:13) {:else}
    function create_else_block_1$3(ctx) {
    	let td;

    	const block = {
    		c: function create() {
    			td = element("td");
    			add_location(td, file$9, 770, 12, 23317);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(770:13) {:else}",
    		ctx
    	});

    	return block;
    }

    // (758:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk") && $user.email === fwr.userMail)}
    function create_if_block_8$1(ctx) {
    	let td;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[27](/*fwr*/ ctx[119]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-check-square-o fa-lg");
    			attr_dev(i, "title", "change status");
    			add_location(i, file$9, 764, 17, 23135);
    			set_style(button, "border", "none");
    			set_style(button, "background", "none");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#changeStatusOfFW");
    			add_location(button, file$9, 759, 15, 22907);
    			add_location(td, file$9, 758, 12, 22887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(758:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\") && $user.email === fwr.userMail)}",
    		ctx
    	});

    	return block;
    }

    // (796:10) {:else}
    function create_else_block$8(ctx) {
    	let td0;
    	let t;
    	let td1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t = space();
    			td1 = element("td");
    			add_location(td0, file$9, 796, 12, 24315);
    			add_location(td1, file$9, 797, 12, 24335);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(796:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (773:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_7$1(ctx) {
    	let td0;
    	let button0;
    	let i0;
    	let t;
    	let td1;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[28](/*fwr*/ ctx[119]);
    	}

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[29](/*fwr*/ ctx[119]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t = space();
    			td1 = element("td");
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-pencil-square-o fa-lg");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$9, 779, 17, 23761);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#editFW");
    			add_location(button0, file$9, 774, 15, 23551);
    			add_location(td0, file$9, 773, 12, 23531);
    			attr_dev(i1, "class", "fa fa-trash-o fa-lg");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$9, 792, 16, 24186);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#deleteFWR");
    			add_location(button1, file$9, 786, 15, 23954);
    			add_location(td1, file$9, 785, 12, 23934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_2, false, false, false),
    					listen_dev(button1, "click", click_handler_3, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(773:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (530:6) {#each firewallRules as fwr}
    function create_each_block_24(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*fwr*/ ctx[119].fwType.name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*fwr*/ ctx[119].context.name + "";
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
    	let li;
    	let button0;
    	let t12_value = /*fwr*/ ctx[119].sgo.name + "";
    	let t12;
    	let button0_data_bs_target_value;
    	let t13;
    	let div;
    	let div_id_value;
    	let t14;
    	let td5;
    	let button1;
    	let t15_value = /*fwr*/ ctx[119].uc.name + "";
    	let t15;
    	let t16;
    	let td6;
    	let t17_value = /*fwr*/ ctx[119].firewallStatus + "";
    	let t17;
    	let t18;
    	let show_if_1;
    	let t19;
    	let show_if;
    	let t20;
    	let mounted;
    	let dispose;
    	let if_block0 = /*fwr*/ ctx[119].sHo && create_if_block_16(ctx);
    	let if_block1 = /*fwr*/ ctx[119].sHgoWithHo && create_if_block_15(ctx);
    	let if_block2 = /*fwr*/ ctx[119].sNo && create_if_block_14(ctx);
    	let if_block3 = /*fwr*/ ctx[119].sNgoWithNo && create_if_block_13(ctx);
    	let if_block4 = /*fwr*/ ctx[119].dHo && create_if_block_12(ctx);
    	let if_block5 = /*fwr*/ ctx[119].dHgoWithHo && create_if_block_11(ctx);
    	let if_block6 = /*fwr*/ ctx[119].dNo && create_if_block_10(ctx);
    	let if_block7 = /*fwr*/ ctx[119].dNgoWithNo && create_if_block_9$1(ctx);
    	let each_value_25 = /*fwr*/ ctx[119].sgo.port;
    	validate_each_argument(each_value_25);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_25.length; i += 1) {
    		each_blocks[i] = create_each_block_25(get_each_context_25(ctx, each_value_25, i));
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[26](/*fwr*/ ctx[119]);
    	}

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*$isAuthenticated, $user, firewallRules*/ 98305) show_if_1 = null;
    		if (show_if_1 == null) show_if_1 = !!(/*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("helpdesk") && /*$user*/ ctx[15].email === /*fwr*/ ctx[119].userMail);
    		if (show_if_1) return create_if_block_8$1;
    		return create_else_block_1$3;
    	}

    	let current_block_type = select_block_type(ctx, [-1, -1, -1, -1, -1]);
    	let if_block8 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (dirty[0] & /*$isAuthenticated, $user*/ 98304) show_if = null;
    		if (show_if == null) show_if = !!(/*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("helpdesk"));
    		if (show_if) return create_if_block_7$1;
    		return create_else_block$8;
    	}

    	let current_block_type_1 = select_block_type_1(ctx, [-1, -1, -1, -1, -1]);
    	let if_block9 = current_block_type_1(ctx);

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
    			li = element("li");
    			button0 = element("button");
    			t12 = text(t12_value);
    			t13 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t14 = space();
    			td5 = element("td");
    			button1 = element("button");
    			t15 = text(t15_value);
    			t16 = space();
    			td6 = element("td");
    			t17 = text(t17_value);
    			t18 = space();
    			if_block8.c();
    			t19 = space();
    			if_block9.c();
    			t20 = space();
    			add_location(td0, file$9, 531, 10, 14277);
    			add_location(td1, file$9, 533, 10, 14317);
    			add_location(td2, file$9, 535, 10, 14358);
    			add_location(td3, file$9, 628, 10, 17907);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-bs-toggle", "collapse");
    			attr_dev(button0, "data-bs-target", button0_data_bs_target_value = "#port" + /*fwr*/ ctx[119].sgo.id + /*fwr*/ ctx[119].fwId);
    			attr_dev(button0, "aria-expanded", "false");
    			attr_dev(button0, "aria-controls", "collapseExample");
    			add_location(button0, file$9, 729, 14, 21679);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$9, 728, 12, 21635);
    			attr_dev(div, "class", "collapse");
    			attr_dev(div, "id", div_id_value = "port" + /*fwr*/ ctx[119].sgo.id + /*fwr*/ ctx[119].fwId);
    			add_location(div, file$9, 740, 12, 22074);
    			add_location(td4, file$9, 727, 10, 21617);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#getUC");
    			add_location(button1, file$9, 749, 12, 22385);
    			add_location(td5, file$9, 748, 10, 22367);
    			add_location(td6, file$9, 756, 10, 22635);
    			add_location(tr, file$9, 530, 8, 14261);
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
    			append_dev(td4, li);
    			append_dev(li, button0);
    			append_dev(button0, t12);
    			append_dev(td4, t13);
    			append_dev(td4, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(tr, t14);
    			append_dev(tr, td5);
    			append_dev(td5, button1);
    			append_dev(button1, t15);
    			append_dev(tr, t16);
    			append_dev(tr, td6);
    			append_dev(td6, t17);
    			append_dev(tr, t18);
    			if_block8.m(tr, null);
    			append_dev(tr, t19);
    			if_block9.m(tr, null);
    			append_dev(tr, t20);

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*firewallRules*/ 1 && t0_value !== (t0_value = /*fwr*/ ctx[119].fwType.name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t2_value !== (t2_value = /*fwr*/ ctx[119].context.name + "")) set_data_dev(t2, t2_value);

    			if (/*fwr*/ ctx[119].sHo) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_16(ctx);
    					if_block0.c();
    					if_block0.m(td2, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*fwr*/ ctx[119].sHgoWithHo) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_15(ctx);
    					if_block1.c();
    					if_block1.m(td2, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*fwr*/ ctx[119].sNo) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_14(ctx);
    					if_block2.c();
    					if_block2.m(td2, t6);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*fwr*/ ctx[119].sNgoWithNo) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_13(ctx);
    					if_block3.c();
    					if_block3.m(td2, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*fwr*/ ctx[119].dHo) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_12(ctx);
    					if_block4.c();
    					if_block4.m(td3, t8);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*fwr*/ ctx[119].dHgoWithHo) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_11(ctx);
    					if_block5.c();
    					if_block5.m(td3, t9);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*fwr*/ ctx[119].dNo) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_10(ctx);
    					if_block6.c();
    					if_block6.m(td3, t10);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*fwr*/ ctx[119].dNgoWithNo) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_9$1(ctx);
    					if_block7.c();
    					if_block7.m(td3, null);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && t12_value !== (t12_value = /*fwr*/ ctx[119].sgo.name + "")) set_data_dev(t12, t12_value);

    			if (dirty[0] & /*firewallRules*/ 1 && button0_data_bs_target_value !== (button0_data_bs_target_value = "#port" + /*fwr*/ ctx[119].sgo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(button0, "data-bs-target", button0_data_bs_target_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1) {
    				each_value_25 = /*fwr*/ ctx[119].sgo.port;
    				validate_each_argument(each_value_25);
    				let i;

    				for (i = 0; i < each_value_25.length; i += 1) {
    					const child_ctx = get_each_context_25(ctx, each_value_25, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_25(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_25.length;
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && div_id_value !== (div_id_value = "port" + /*fwr*/ ctx[119].sgo.id + /*fwr*/ ctx[119].fwId)) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty[0] & /*firewallRules*/ 1 && t15_value !== (t15_value = /*fwr*/ ctx[119].uc.name + "")) set_data_dev(t15, t15_value);
    			if (dirty[0] & /*firewallRules*/ 1 && t17_value !== (t17_value = /*fwr*/ ctx[119].firewallStatus + "")) set_data_dev(t17, t17_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block8) {
    				if_block8.p(ctx, dirty);
    			} else {
    				if_block8.d(1);
    				if_block8 = current_block_type(ctx);

    				if (if_block8) {
    					if_block8.c();
    					if_block8.m(tr, t19);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx, dirty)) && if_block9) {
    				if_block9.p(ctx, dirty);
    			} else {
    				if_block9.d(1);
    				if_block9 = current_block_type_1(ctx);

    				if (if_block9) {
    					if_block9.c();
    					if_block9.m(tr, t20);
    				}
    			}
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
    			if_block8.d();
    			if_block9.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_24.name,
    		type: "each",
    		source: "(530:6) {#each firewallRules as fwr}",
    		ctx
    	});

    	return block;
    }

    // (838:16) {#each fwTypes as fwT}
    function create_each_block_23(ctx) {
    	let option;
    	let t_value = /*fwT*/ ctx[92].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*fwT*/ ctx[92].id;
    			option.value = option.__value;
    			add_location(option, file$9, 838, 18, 25468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*fwTypes*/ 8 && t_value !== (t_value = /*fwT*/ ctx[92].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*fwTypes*/ 8 && option_value_value !== (option_value_value = /*fwT*/ ctx[92].id)) {
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
    		id: create_each_block_23.name,
    		type: "each",
    		source: "(838:16) {#each fwTypes as fwT}",
    		ctx
    	});

    	return block;
    }

    // (853:16) {#each contexts as c}
    function create_each_block_22(ctx) {
    	let option;
    	let t_value = /*c*/ ctx[89].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*c*/ ctx[89].id;
    			option.value = option.__value;
    			add_location(option, file$9, 853, 18, 25996);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contexts*/ 16 && t_value !== (t_value = /*c*/ ctx[89].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*contexts*/ 16 && option_value_value !== (option_value_value = /*c*/ ctx[89].id)) {
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
    		id: create_each_block_22.name,
    		type: "each",
    		source: "(853:16) {#each contexts as c}",
    		ctx
    	});

    	return block;
    }

    // (869:18) {#each hostOs as ho}
    function create_each_block_21(ctx) {
    	let option;
    	let t_value = /*ho*/ ctx[78].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*ho*/ ctx[78].id;
    			option.value = option.__value;
    			add_location(option, file$9, 869, 20, 26568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostOs*/ 32 && t_value !== (t_value = /*ho*/ ctx[78].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*hostOs*/ 32 && option_value_value !== (option_value_value = /*ho*/ ctx[78].id)) {
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
    		id: create_each_block_21.name,
    		type: "each",
    		source: "(869:18) {#each hostOs as ho}",
    		ctx
    	});

    	return block;
    }

    // (874:18) {#each hostGs as hg}
    function create_each_block_20(ctx) {
    	let option;
    	let t_value = /*hg*/ ctx[75].hgoName + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*hg*/ ctx[75].hgoId;
    			option.value = option.__value;
    			add_location(option, file$9, 874, 20, 26781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostGs*/ 64 && t_value !== (t_value = /*hg*/ ctx[75].hgoName + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*hostGs*/ 64 && option_value_value !== (option_value_value = /*hg*/ ctx[75].hgoId)) {
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
    		id: create_each_block_20.name,
    		type: "each",
    		source: "(874:18) {#each hostGs as hg}",
    		ctx
    	});

    	return block;
    }

    // (879:18) {#each networkOs as no}
    function create_each_block_19(ctx) {
    	let option;
    	let t_value = /*no*/ ctx[72].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*no*/ ctx[72].id;
    			option.value = option.__value;
    			add_location(option, file$9, 879, 20, 27000);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkOs*/ 128 && t_value !== (t_value = /*no*/ ctx[72].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*networkOs*/ 128 && option_value_value !== (option_value_value = /*no*/ ctx[72].id)) {
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
    		id: create_each_block_19.name,
    		type: "each",
    		source: "(879:18) {#each networkOs as no}",
    		ctx
    	});

    	return block;
    }

    // (884:18) {#each networkGs as ng}
    function create_each_block_18(ctx) {
    	let option;
    	let t_value = /*ng*/ ctx[69].ngoName + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*ng*/ ctx[69].ngoId;
    			option.value = option.__value;
    			add_location(option, file$9, 884, 20, 27219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkGs*/ 256 && t_value !== (t_value = /*ng*/ ctx[69].ngoName + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*networkGs*/ 256 && option_value_value !== (option_value_value = /*ng*/ ctx[69].ngoId)) {
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
    		id: create_each_block_18.name,
    		type: "each",
    		source: "(884:18) {#each networkGs as ng}",
    		ctx
    	});

    	return block;
    }

    // (901:18) {#each hostOs as ho}
    function create_each_block_17(ctx) {
    	let option;
    	let t_value = /*ho*/ ctx[78].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*ho*/ ctx[78].id;
    			option.value = option.__value;
    			add_location(option, file$9, 901, 20, 27850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostOs*/ 32 && t_value !== (t_value = /*ho*/ ctx[78].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*hostOs*/ 32 && option_value_value !== (option_value_value = /*ho*/ ctx[78].id)) {
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
    		id: create_each_block_17.name,
    		type: "each",
    		source: "(901:18) {#each hostOs as ho}",
    		ctx
    	});

    	return block;
    }

    // (906:18) {#each hostGs as hg}
    function create_each_block_16(ctx) {
    	let option;
    	let t_value = /*hg*/ ctx[75].hgoName + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*hg*/ ctx[75].hgoId;
    			option.value = option.__value;
    			add_location(option, file$9, 906, 20, 28063);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostGs*/ 64 && t_value !== (t_value = /*hg*/ ctx[75].hgoName + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*hostGs*/ 64 && option_value_value !== (option_value_value = /*hg*/ ctx[75].hgoId)) {
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
    		id: create_each_block_16.name,
    		type: "each",
    		source: "(906:18) {#each hostGs as hg}",
    		ctx
    	});

    	return block;
    }

    // (911:18) {#each networkOs as no}
    function create_each_block_15(ctx) {
    	let option;
    	let t_value = /*no*/ ctx[72].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*no*/ ctx[72].id;
    			option.value = option.__value;
    			add_location(option, file$9, 911, 20, 28282);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkOs*/ 128 && t_value !== (t_value = /*no*/ ctx[72].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*networkOs*/ 128 && option_value_value !== (option_value_value = /*no*/ ctx[72].id)) {
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
    		id: create_each_block_15.name,
    		type: "each",
    		source: "(911:18) {#each networkOs as no}",
    		ctx
    	});

    	return block;
    }

    // (916:18) {#each networkGs as ng}
    function create_each_block_14(ctx) {
    	let option;
    	let t_value = /*ng*/ ctx[69].ngoName + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*ng*/ ctx[69].ngoId;
    			option.value = option.__value;
    			add_location(option, file$9, 916, 20, 28501);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkGs*/ 256 && t_value !== (t_value = /*ng*/ ctx[69].ngoName + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*networkGs*/ 256 && option_value_value !== (option_value_value = /*ng*/ ctx[69].ngoId)) {
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
    		id: create_each_block_14.name,
    		type: "each",
    		source: "(916:18) {#each networkGs as ng}",
    		ctx
    	});

    	return block;
    }

    // (932:16) {#each serviceGs as sgo}
    function create_each_block_13(ctx) {
    	let option;
    	let t_value = /*sgo*/ ctx[66].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*sgo*/ ctx[66].id;
    			option.value = option.__value;
    			add_location(option, file$9, 932, 18, 29083);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*serviceGs*/ 512 && t_value !== (t_value = /*sgo*/ ctx[66].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*serviceGs*/ 512 && option_value_value !== (option_value_value = /*sgo*/ ctx[66].id)) {
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
    		id: create_each_block_13.name,
    		type: "each",
    		source: "(932:16) {#each serviceGs as sgo}",
    		ctx
    	});

    	return block;
    }

    // (947:16) {#each usecases as u}
    function create_each_block_12(ctx) {
    	let option;
    	let t_value = /*u*/ ctx[63].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*u*/ ctx[63].id;
    			option.value = option.__value;
    			add_location(option, file$9, 947, 18, 29602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*usecases*/ 1024 && t_value !== (t_value = /*u*/ ctx[63].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*usecases*/ 1024 && option_value_value !== (option_value_value = /*u*/ ctx[63].id)) {
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
    		id: create_each_block_12.name,
    		type: "each",
    		source: "(947:16) {#each usecases as u}",
    		ctx
    	});

    	return block;
    }

    // (1015:16) {#each fwTypes as fwT}
    function create_each_block_11(ctx) {
    	let option;
    	let t_value = /*fwT*/ ctx[92].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*fwT*/ ctx[92].id;
    			option.value = option.__value;
    			add_location(option, file$9, 1015, 18, 31567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*fwTypes*/ 8 && t_value !== (t_value = /*fwT*/ ctx[92].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*fwTypes*/ 8 && option_value_value !== (option_value_value = /*fwT*/ ctx[92].id)) {
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
    		id: create_each_block_11.name,
    		type: "each",
    		source: "(1015:16) {#each fwTypes as fwT}",
    		ctx
    	});

    	return block;
    }

    // (1030:16) {#each contexts as c}
    function create_each_block_10(ctx) {
    	let option;
    	let t_value = /*c*/ ctx[89].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*c*/ ctx[89].id;
    			option.value = option.__value;
    			add_location(option, file$9, 1030, 18, 32089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contexts*/ 16 && t_value !== (t_value = /*c*/ ctx[89].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*contexts*/ 16 && option_value_value !== (option_value_value = /*c*/ ctx[89].id)) {
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
    		id: create_each_block_10.name,
    		type: "each",
    		source: "(1030:16) {#each contexts as c}",
    		ctx
    	});

    	return block;
    }

    // (1046:18) {#each hostOs as ho}
    function create_each_block_9(ctx) {
    	let option;
    	let t_value = /*ho*/ ctx[78].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*ho*/ ctx[78].id;
    			option.value = option.__value;
    			add_location(option, file$9, 1046, 20, 32655);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostOs*/ 32 && t_value !== (t_value = /*ho*/ ctx[78].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*hostOs*/ 32 && option_value_value !== (option_value_value = /*ho*/ ctx[78].id)) {
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
    		id: create_each_block_9.name,
    		type: "each",
    		source: "(1046:18) {#each hostOs as ho}",
    		ctx
    	});

    	return block;
    }

    // (1051:18) {#each hostGs as hg}
    function create_each_block_8(ctx) {
    	let option;
    	let t_value = /*hg*/ ctx[75].hgoName + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*hg*/ ctx[75].hgoId;
    			option.value = option.__value;
    			add_location(option, file$9, 1051, 20, 32868);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostGs*/ 64 && t_value !== (t_value = /*hg*/ ctx[75].hgoName + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*hostGs*/ 64 && option_value_value !== (option_value_value = /*hg*/ ctx[75].hgoId)) {
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
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(1051:18) {#each hostGs as hg}",
    		ctx
    	});

    	return block;
    }

    // (1056:18) {#each networkOs as no}
    function create_each_block_7(ctx) {
    	let option;
    	let t_value = /*no*/ ctx[72].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*no*/ ctx[72].id;
    			option.value = option.__value;
    			add_location(option, file$9, 1056, 20, 33087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkOs*/ 128 && t_value !== (t_value = /*no*/ ctx[72].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*networkOs*/ 128 && option_value_value !== (option_value_value = /*no*/ ctx[72].id)) {
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
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(1056:18) {#each networkOs as no}",
    		ctx
    	});

    	return block;
    }

    // (1061:18) {#each networkGs as ng}
    function create_each_block_6(ctx) {
    	let option;
    	let t_value = /*ng*/ ctx[69].ngoName + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*ng*/ ctx[69].ngoId;
    			option.value = option.__value;
    			add_location(option, file$9, 1061, 20, 33306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkGs*/ 256 && t_value !== (t_value = /*ng*/ ctx[69].ngoName + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*networkGs*/ 256 && option_value_value !== (option_value_value = /*ng*/ ctx[69].ngoId)) {
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
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(1061:18) {#each networkGs as ng}",
    		ctx
    	});

    	return block;
    }

    // (1078:18) {#each hostOs as ho}
    function create_each_block_5(ctx) {
    	let option;
    	let t_value = /*ho*/ ctx[78].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*ho*/ ctx[78].id;
    			option.value = option.__value;
    			add_location(option, file$9, 1078, 20, 33931);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostOs*/ 32 && t_value !== (t_value = /*ho*/ ctx[78].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*hostOs*/ 32 && option_value_value !== (option_value_value = /*ho*/ ctx[78].id)) {
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
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(1078:18) {#each hostOs as ho}",
    		ctx
    	});

    	return block;
    }

    // (1083:18) {#each hostGs as hg}
    function create_each_block_4$1(ctx) {
    	let option;
    	let t_value = /*hg*/ ctx[75].hgoName + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*hg*/ ctx[75].hgoId;
    			option.value = option.__value;
    			add_location(option, file$9, 1083, 20, 34144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostGs*/ 64 && t_value !== (t_value = /*hg*/ ctx[75].hgoName + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*hostGs*/ 64 && option_value_value !== (option_value_value = /*hg*/ ctx[75].hgoId)) {
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
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(1083:18) {#each hostGs as hg}",
    		ctx
    	});

    	return block;
    }

    // (1088:18) {#each networkOs as no}
    function create_each_block_3$3(ctx) {
    	let option;
    	let t_value = /*no*/ ctx[72].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*no*/ ctx[72].id;
    			option.value = option.__value;
    			add_location(option, file$9, 1088, 20, 34363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkOs*/ 128 && t_value !== (t_value = /*no*/ ctx[72].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*networkOs*/ 128 && option_value_value !== (option_value_value = /*no*/ ctx[72].id)) {
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
    		id: create_each_block_3$3.name,
    		type: "each",
    		source: "(1088:18) {#each networkOs as no}",
    		ctx
    	});

    	return block;
    }

    // (1093:18) {#each networkGs as ng}
    function create_each_block_2$3(ctx) {
    	let option;
    	let t_value = /*ng*/ ctx[69].ngoName + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*ng*/ ctx[69].ngoId;
    			option.value = option.__value;
    			add_location(option, file$9, 1093, 20, 34582);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkGs*/ 256 && t_value !== (t_value = /*ng*/ ctx[69].ngoName + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*networkGs*/ 256 && option_value_value !== (option_value_value = /*ng*/ ctx[69].ngoId)) {
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
    		id: create_each_block_2$3.name,
    		type: "each",
    		source: "(1093:18) {#each networkGs as ng}",
    		ctx
    	});

    	return block;
    }

    // (1109:16) {#each serviceGs as sgo}
    function create_each_block_1$5(ctx) {
    	let option;
    	let t_value = /*sgo*/ ctx[66].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*sgo*/ ctx[66].id;
    			option.value = option.__value;
    			add_location(option, file$9, 1109, 18, 35158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*serviceGs*/ 512 && t_value !== (t_value = /*sgo*/ ctx[66].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*serviceGs*/ 512 && option_value_value !== (option_value_value = /*sgo*/ ctx[66].id)) {
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
    		id: create_each_block_1$5.name,
    		type: "each",
    		source: "(1109:16) {#each serviceGs as sgo}",
    		ctx
    	});

    	return block;
    }

    // (1124:16) {#each usecases as u}
    function create_each_block$8(ctx) {
    	let option;
    	let t_value = /*u*/ ctx[63].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*u*/ ctx[63].id;
    			option.value = option.__value;
    			add_location(option, file$9, 1124, 18, 35671);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*usecases*/ 1024 && t_value !== (t_value = /*u*/ ctx[63].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*usecases*/ 1024 && option_value_value !== (option_value_value = /*u*/ ctx[63].id)) {
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
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(1124:16) {#each usecases as u}",
    		ctx
    	});

    	return block;
    }

    // (1402:101) 
    function create_if_block_6$1(ctx) {
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "REQUESTED_FOR_APPROVAL";
    			option1 = element("option");
    			option1.textContent = "ACTIVE";
    			option2 = element("option");
    			option2.textContent = "APPROVED";
    			option3 = element("option");
    			option3.textContent = "DELETED";
    			option4 = element("option");
    			option4.textContent = "DISABLED";
    			option5 = element("option");
    			option5.textContent = "EDITED";
    			option6 = element("option");
    			option6.textContent = "ORDERED";
    			option7 = element("option");
    			option7.textContent = "REJECTED";
    			option0.__value = "REQUESTED_FOR_APPROVAL";
    			option0.value = option0.__value;
    			option0.hidden = true;
    			add_location(option0, file$9, 1402, 18, 44940);
    			option1.__value = "ACTIVE";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 1405, 18, 45079);
    			option2.__value = "APPROVED";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 1406, 18, 45137);
    			option3.__value = "DELETED";
    			option3.value = option3.__value;
    			add_location(option3, file$9, 1407, 18, 45199);
    			option4.__value = "DISABLED";
    			option4.value = option4.__value;
    			add_location(option4, file$9, 1408, 18, 45259);
    			option5.__value = "EDITED";
    			option5.value = option5.__value;
    			add_location(option5, file$9, 1409, 18, 45321);
    			option6.__value = "ORDERED";
    			option6.value = option6.__value;
    			add_location(option6, file$9, 1410, 18, 45379);
    			option7.__value = "REJECTED";
    			option7.value = option7.__value;
    			add_location(option7, file$9, 1411, 18, 45439);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, option5, anchor);
    			insert_dev(target, option6, anchor);
    			insert_dev(target, option7, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(option5);
    			if (detaching) detach_dev(option6);
    			if (detaching) detach_dev(option7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(1402:101) ",
    		ctx
    	});

    	return block;
    }

    // (1398:136) 
    function create_if_block_5$1(ctx) {
    	let option0;
    	let option1;
    	let option2;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "DISABLED";
    			option1 = element("option");
    			option1.textContent = "ACTIVE";
    			option2 = element("option");
    			option2.textContent = "DELETED";
    			option0.__value = "DISABLED";
    			option0.value = option0.__value;
    			option0.hidden = true;
    			add_location(option0, file$9, 1398, 18, 44650);
    			option1.__value = "ACTIVE";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 1399, 18, 44719);
    			option2.__value = "DELETED";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 1400, 18, 44777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, option2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(option2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(1398:136) ",
    		ctx
    	});

    	return block;
    }

    // (1394:134) 
    function create_if_block_4$2(ctx) {
    	let option0;
    	let option1;
    	let option2;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "ACTIVE";
    			option1 = element("option");
    			option1.textContent = "DELETED";
    			option2 = element("option");
    			option2.textContent = "DISABLED";
    			option0.__value = "ACTIVE";
    			option0.value = option0.__value;
    			option0.hidden = true;
    			add_location(option0, file$9, 1394, 18, 44325);
    			option1.__value = "DELETED";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 1395, 18, 44390);
    			option2.__value = "DISABLED";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 1396, 18, 44450);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, option2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(option2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(1394:134) ",
    		ctx
    	});

    	return block;
    }

    // (1392:94) 
    function create_if_block_3$2(ctx) {
    	let option;

    	const block = {
    		c: function create() {
    			option = element("option");
    			option.textContent = "ACTIVE";
    			option.__value = "ACTIVE";
    			option.value = option.__value;
    			option.hidden = true;
    			add_location(option, file$9, 1392, 18, 44124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(1392:94) ",
    		ctx
    	});

    	return block;
    }

    // (1389:177) 
    function create_if_block_2$5(ctx) {
    	let option0;
    	let option1;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "ORDERED";
    			option1 = element("option");
    			option1.textContent = "ACTIVE";
    			option0.__value = "ORDERED";
    			option0.value = option0.__value;
    			option0.hidden = true;
    			add_location(option0, file$9, 1389, 18, 43903);
    			option1.__value = "ACTIVE";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 1390, 18, 43970);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, option1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(option1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(1389:177) ",
    		ctx
    	});

    	return block;
    }

    // (1386:178) 
    function create_if_block_1$9(ctx) {
    	let option0;
    	let option1;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "APPROVED";
    			option1 = element("option");
    			option1.textContent = "ORDERED";
    			option0.__value = "APPROVED";
    			option0.value = option0.__value;
    			option0.hidden = true;
    			add_location(option0, file$9, 1386, 18, 43595);
    			option1.__value = "ORDERED";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 1387, 18, 43664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, option1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(option1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(1386:178) ",
    		ctx
    	});

    	return block;
    }

    // (1380:16) {#if fwrStatus.status === "REQUESTED_FOR_APPROVAL" && $isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")}
    function create_if_block$9(ctx) {
    	let option0;
    	let option1;
    	let option2;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "REQUESTED_FOR_APPROVAL";
    			option1 = element("option");
    			option1.textContent = "APPROVED";
    			option2 = element("option");
    			option2.textContent = "REJECTED";
    			option0.__value = "REQUESTED_FOR_APPROVAL";
    			option0.value = option0.__value;
    			option0.hidden = true;
    			add_location(option0, file$9, 1380, 18, 43152);
    			option1.__value = "APPROVED";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 1383, 18, 43291);
    			option2.__value = "REJECTED";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 1384, 18, 43353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, option2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(option2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(1380:16) {#if fwrStatus.status === \\\"REQUESTED_FOR_APPROVAL\\\" && $isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let show_if_6 = /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("helpdesk");
    	let t3;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t4;
    	let span0;
    	let i0;
    	let t5;
    	let th1;
    	let t6;
    	let span1;
    	let i1;
    	let t7;
    	let th2;
    	let t8;
    	let span2;
    	let i2;
    	let t9;
    	let th3;
    	let t10;
    	let span3;
    	let i3;
    	let t11;
    	let th4;
    	let t12;
    	let span4;
    	let i4;
    	let t13;
    	let th5;
    	let t14;
    	let span5;
    	let i5;
    	let t15;
    	let th6;
    	let t16;
    	let span6;
    	let i6;
    	let t17;
    	let th7;
    	let t18;
    	let th8;
    	let t19;
    	let th9;
    	let t20;
    	let tbody;
    	let t21;
    	let div22;
    	let div21;
    	let div20;
    	let div5;
    	let h50;
    	let t23;
    	let button0;
    	let span7;
    	let t25;
    	let div18;
    	let form0;
    	let div7;
    	let div6;
    	let label0;
    	let t27;
    	let select0;
    	let option0;
    	let t28;
    	let div9;
    	let div8;
    	let label1;
    	let t30;
    	let select1;
    	let option1;
    	let t31;
    	let div11;
    	let div10;
    	let label2;
    	let t33;
    	let select2;
    	let option2;
    	let optgroup0;
    	let optgroup1;
    	let optgroup2;
    	let optgroup3;
    	let t34;
    	let div13;
    	let div12;
    	let label3;
    	let t36;
    	let select3;
    	let option3;
    	let optgroup4;
    	let optgroup5;
    	let optgroup6;
    	let optgroup7;
    	let t37;
    	let div15;
    	let div14;
    	let label4;
    	let t39;
    	let select4;
    	let option4;
    	let t40;
    	let div17;
    	let div16;
    	let label5;
    	let t42;
    	let select5;
    	let option5;
    	let t43;
    	let div19;
    	let button1;
    	let t45;
    	let button2;
    	let t47;
    	let div42;
    	let div41;
    	let div40;
    	let div23;
    	let h51;
    	let t49;
    	let button3;
    	let span8;
    	let t51;
    	let div38;
    	let form1;
    	let div25;
    	let div24;
    	let label6;
    	let t53;
    	let input0;
    	let t54;
    	let div27;
    	let div26;
    	let label7;
    	let t56;
    	let select6;
    	let option6;
    	let t57;
    	let div29;
    	let div28;
    	let label8;
    	let t59;
    	let select7;
    	let option7;
    	let t60;
    	let div31;
    	let div30;
    	let label9;
    	let t62;
    	let select8;
    	let option8;
    	let optgroup8;
    	let optgroup9;
    	let optgroup10;
    	let optgroup11;
    	let t63;
    	let div33;
    	let div32;
    	let label10;
    	let t65;
    	let select9;
    	let option9;
    	let optgroup12;
    	let optgroup13;
    	let optgroup14;
    	let optgroup15;
    	let t66;
    	let div35;
    	let div34;
    	let label11;
    	let t68;
    	let select10;
    	let option10;
    	let t69;
    	let div37;
    	let div36;
    	let label12;
    	let t71;
    	let select11;
    	let option11;
    	let t72;
    	let div39;
    	let button4;
    	let t74;
    	let button5;
    	let t76;
    	let div48;
    	let div47;
    	let div46;
    	let div43;
    	let h52;
    	let t78;
    	let button6;
    	let span9;
    	let t80;
    	let div44;
    	let h60;
    	let strong0;
    	let t82;
    	let t83_value = /*usecase*/ ctx[11].name + "";
    	let t83;
    	let t84;
    	let br0;
    	let t85;
    	let br1;
    	let t86;
    	let h61;
    	let strong1;
    	let t88;
    	let t89_value = /*usecase*/ ctx[11].description + "";
    	let t89;
    	let t90;
    	let br2;
    	let t91;
    	let br3;
    	let t92;
    	let h62;
    	let strong2;
    	let t94;
    	let t95_value = /*usecase*/ ctx[11].tags + "";
    	let t95;
    	let t96;
    	let br4;
    	let t97;
    	let br5;
    	let t98;
    	let div45;
    	let button7;
    	let t100;
    	let div54;
    	let div53;
    	let div52;
    	let div49;
    	let h53;
    	let t102;
    	let button8;
    	let span10;
    	let t104;
    	let div50;
    	let t105;
    	let br6;
    	let t106;
    	let br7;
    	let t107;
    	let h63;
    	let strong3;
    	let t109;
    	let t110_value = /*fwrDelete*/ ctx[13].fwTypeName + "";
    	let t110;
    	let t111;
    	let br8;
    	let t112;
    	let br9;
    	let t113;
    	let h64;
    	let strong4;
    	let t115;
    	let t116_value = /*fwrDelete*/ ctx[13].contextName + "";
    	let t116;
    	let t117;
    	let br10;
    	let t118;
    	let br11;
    	let t119;
    	let h65;
    	let strong5;
    	let t121;
    	let t122_value = /*fwrDelete*/ ctx[13].sourceName + "";
    	let t122;
    	let t123;
    	let br12;
    	let t124;
    	let br13;
    	let t125;
    	let h66;
    	let strong6;
    	let t127;
    	let t128_value = /*fwrDelete*/ ctx[13].destionationName + "";
    	let t128;
    	let t129;
    	let br14;
    	let t130;
    	let br15;
    	let t131;
    	let h67;
    	let strong7;
    	let t133;
    	let t134_value = /*fwrDelete*/ ctx[13].serviceGroupObjectName + "";
    	let t134;
    	let t135;
    	let br16;
    	let t136;
    	let br17;
    	let t137;
    	let h68;
    	let strong8;
    	let t139;
    	let t140_value = /*fwrDelete*/ ctx[13].useCaseName + "";
    	let t140;
    	let t141;
    	let br18;
    	let t142;
    	let br19;
    	let t143;
    	let div51;
    	let button9;
    	let t145;
    	let button10;
    	let t147;
    	let div76;
    	let div75;
    	let div74;
    	let div55;
    	let h54;
    	let t149;
    	let button11;
    	let span11;
    	let t151;
    	let div72;
    	let form2;
    	let div57;
    	let div56;
    	let label13;
    	let t153;
    	let input1;
    	let t154;
    	let div59;
    	let div58;
    	let label14;
    	let t156;
    	let input2;
    	let t157;
    	let div61;
    	let div60;
    	let label15;
    	let t159;
    	let input3;
    	let t160;
    	let div63;
    	let div62;
    	let label16;
    	let t162;
    	let input4;
    	let t163;
    	let div65;
    	let div64;
    	let label17;
    	let t165;
    	let input5;
    	let t166;
    	let div67;
    	let div66;
    	let label18;
    	let t168;
    	let input6;
    	let t169;
    	let div69;
    	let div68;
    	let label19;
    	let t171;
    	let input7;
    	let t172;
    	let div71;
    	let div70;
    	let label20;
    	let t174;
    	let select12;
    	let option12;
    	let show_if;
    	let show_if_1;
    	let show_if_2;
    	let show_if_3;
    	let show_if_4;
    	let show_if_5;
    	let t176;
    	let div73;
    	let button12;
    	let t178;
    	let button13;
    	let mounted;
    	let dispose;
    	let if_block0 = show_if_6 && create_if_block_17(ctx);
    	let each_value_24 = /*firewallRules*/ ctx[0];
    	validate_each_argument(each_value_24);
    	let each_blocks_24 = [];

    	for (let i = 0; i < each_value_24.length; i += 1) {
    		each_blocks_24[i] = create_each_block_24(get_each_context_24(ctx, each_value_24, i));
    	}

    	let each_value_23 = /*fwTypes*/ ctx[3];
    	validate_each_argument(each_value_23);
    	let each_blocks_23 = [];

    	for (let i = 0; i < each_value_23.length; i += 1) {
    		each_blocks_23[i] = create_each_block_23(get_each_context_23(ctx, each_value_23, i));
    	}

    	let each_value_22 = /*contexts*/ ctx[4];
    	validate_each_argument(each_value_22);
    	let each_blocks_22 = [];

    	for (let i = 0; i < each_value_22.length; i += 1) {
    		each_blocks_22[i] = create_each_block_22(get_each_context_22(ctx, each_value_22, i));
    	}

    	let each_value_21 = /*hostOs*/ ctx[5];
    	validate_each_argument(each_value_21);
    	let each_blocks_21 = [];

    	for (let i = 0; i < each_value_21.length; i += 1) {
    		each_blocks_21[i] = create_each_block_21(get_each_context_21(ctx, each_value_21, i));
    	}

    	let each_value_20 = /*hostGs*/ ctx[6];
    	validate_each_argument(each_value_20);
    	let each_blocks_20 = [];

    	for (let i = 0; i < each_value_20.length; i += 1) {
    		each_blocks_20[i] = create_each_block_20(get_each_context_20(ctx, each_value_20, i));
    	}

    	let each_value_19 = /*networkOs*/ ctx[7];
    	validate_each_argument(each_value_19);
    	let each_blocks_19 = [];

    	for (let i = 0; i < each_value_19.length; i += 1) {
    		each_blocks_19[i] = create_each_block_19(get_each_context_19(ctx, each_value_19, i));
    	}

    	let each_value_18 = /*networkGs*/ ctx[8];
    	validate_each_argument(each_value_18);
    	let each_blocks_18 = [];

    	for (let i = 0; i < each_value_18.length; i += 1) {
    		each_blocks_18[i] = create_each_block_18(get_each_context_18(ctx, each_value_18, i));
    	}

    	let each_value_17 = /*hostOs*/ ctx[5];
    	validate_each_argument(each_value_17);
    	let each_blocks_17 = [];

    	for (let i = 0; i < each_value_17.length; i += 1) {
    		each_blocks_17[i] = create_each_block_17(get_each_context_17(ctx, each_value_17, i));
    	}

    	let each_value_16 = /*hostGs*/ ctx[6];
    	validate_each_argument(each_value_16);
    	let each_blocks_16 = [];

    	for (let i = 0; i < each_value_16.length; i += 1) {
    		each_blocks_16[i] = create_each_block_16(get_each_context_16(ctx, each_value_16, i));
    	}

    	let each_value_15 = /*networkOs*/ ctx[7];
    	validate_each_argument(each_value_15);
    	let each_blocks_15 = [];

    	for (let i = 0; i < each_value_15.length; i += 1) {
    		each_blocks_15[i] = create_each_block_15(get_each_context_15(ctx, each_value_15, i));
    	}

    	let each_value_14 = /*networkGs*/ ctx[8];
    	validate_each_argument(each_value_14);
    	let each_blocks_14 = [];

    	for (let i = 0; i < each_value_14.length; i += 1) {
    		each_blocks_14[i] = create_each_block_14(get_each_context_14(ctx, each_value_14, i));
    	}

    	let each_value_13 = /*serviceGs*/ ctx[9];
    	validate_each_argument(each_value_13);
    	let each_blocks_13 = [];

    	for (let i = 0; i < each_value_13.length; i += 1) {
    		each_blocks_13[i] = create_each_block_13(get_each_context_13(ctx, each_value_13, i));
    	}

    	let each_value_12 = /*usecases*/ ctx[10];
    	validate_each_argument(each_value_12);
    	let each_blocks_12 = [];

    	for (let i = 0; i < each_value_12.length; i += 1) {
    		each_blocks_12[i] = create_each_block_12(get_each_context_12(ctx, each_value_12, i));
    	}

    	let each_value_11 = /*fwTypes*/ ctx[3];
    	validate_each_argument(each_value_11);
    	let each_blocks_11 = [];

    	for (let i = 0; i < each_value_11.length; i += 1) {
    		each_blocks_11[i] = create_each_block_11(get_each_context_11(ctx, each_value_11, i));
    	}

    	let each_value_10 = /*contexts*/ ctx[4];
    	validate_each_argument(each_value_10);
    	let each_blocks_10 = [];

    	for (let i = 0; i < each_value_10.length; i += 1) {
    		each_blocks_10[i] = create_each_block_10(get_each_context_10(ctx, each_value_10, i));
    	}

    	let each_value_9 = /*hostOs*/ ctx[5];
    	validate_each_argument(each_value_9);
    	let each_blocks_9 = [];

    	for (let i = 0; i < each_value_9.length; i += 1) {
    		each_blocks_9[i] = create_each_block_9(get_each_context_9(ctx, each_value_9, i));
    	}

    	let each_value_8 = /*hostGs*/ ctx[6];
    	validate_each_argument(each_value_8);
    	let each_blocks_8 = [];

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		each_blocks_8[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
    	}

    	let each_value_7 = /*networkOs*/ ctx[7];
    	validate_each_argument(each_value_7);
    	let each_blocks_7 = [];

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		each_blocks_7[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
    	}

    	let each_value_6 = /*networkGs*/ ctx[8];
    	validate_each_argument(each_value_6);
    	let each_blocks_6 = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks_6[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	let each_value_5 = /*hostOs*/ ctx[5];
    	validate_each_argument(each_value_5);
    	let each_blocks_5 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_5[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*hostGs*/ ctx[6];
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*networkOs*/ ctx[7];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3$3(get_each_context_3$3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*networkGs*/ ctx[8];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$3(get_each_context_2$3(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*serviceGs*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$5(get_each_context_1$5(ctx, each_value_1, i));
    	}

    	let each_value = /*usecases*/ ctx[10];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	function select_block_type_2(ctx, dirty) {
    		if (dirty[0] & /*fwrStatus, $isAuthenticated, $user*/ 114688) show_if = null;
    		if (dirty[0] & /*fwrStatus, $isAuthenticated, $user*/ 114688) show_if_1 = null;
    		if (dirty[0] & /*fwrStatus, $isAuthenticated, $user*/ 114688) show_if_2 = null;
    		if (dirty[0] & /*fwrStatus, $isAuthenticated, $user*/ 114688) show_if_3 = null;
    		if (dirty[0] & /*fwrStatus, $isAuthenticated, $user*/ 114688) show_if_4 = null;
    		if (dirty[0] & /*$isAuthenticated, $user*/ 98304) show_if_5 = null;
    		if (show_if == null) show_if = !!(/*fwrStatus*/ ctx[14].status === "REQUESTED_FOR_APPROVAL" && /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin"));
    		if (show_if) return create_if_block$9;
    		if (show_if_1 == null) show_if_1 = !!(/*fwrStatus*/ ctx[14].status === "APPROVED" && (/*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin") || /*$user*/ ctx[15].email === /*fwrStatus*/ ctx[14].userMail));
    		if (show_if_1) return create_if_block_1$9;
    		if (show_if_2 == null) show_if_2 = !!(/*fwrStatus*/ ctx[14].status === "ORDERED" && (/*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin") || /*$user*/ ctx[15].email === /*fwrStatus*/ ctx[14].userMail));
    		if (show_if_2) return create_if_block_2$5;
    		if (/*fwrStatus*/ ctx[14].status === "ACTIVE" && /*$user*/ ctx[15].email === /*fwrStatus*/ ctx[14].userMail) return create_if_block_3$2;
    		if (show_if_3 == null) show_if_3 = !!(/*fwrStatus*/ ctx[14].status === "ACTIVE" && /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin"));
    		if (show_if_3) return create_if_block_4$2;
    		if (show_if_4 == null) show_if_4 = !!(/*fwrStatus*/ ctx[14].status === "DISABLED" && /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin"));
    		if (show_if_4) return create_if_block_5$1;
    		if (show_if_5 == null) show_if_5 = !!(/*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin"));
    		if (show_if_5) return create_if_block_6$1;
    	}

    	let current_block_type = select_block_type_2(ctx, [-1, -1, -1, -1, -1]);
    	let if_block1 = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Firewall Rules";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t4 = text("FW Type ");
    			span0 = element("span");
    			i0 = element("i");
    			t5 = space();
    			th1 = element("th");
    			t6 = text("Context ");
    			span1 = element("span");
    			i1 = element("i");
    			t7 = space();
    			th2 = element("th");
    			t8 = text("Source ");
    			span2 = element("span");
    			i2 = element("i");
    			t9 = space();
    			th3 = element("th");
    			t10 = text("Destination ");
    			span3 = element("span");
    			i3 = element("i");
    			t11 = space();
    			th4 = element("th");
    			t12 = text("Ports ");
    			span4 = element("span");
    			i4 = element("i");
    			t13 = space();
    			th5 = element("th");
    			t14 = text("Use Case ");
    			span5 = element("span");
    			i5 = element("i");
    			t15 = space();
    			th6 = element("th");
    			t16 = text("Status ");
    			span6 = element("span");
    			i6 = element("i");
    			t17 = space();
    			th7 = element("th");
    			t18 = space();
    			th8 = element("th");
    			t19 = space();
    			th9 = element("th");
    			t20 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_24.length; i += 1) {
    				each_blocks_24[i].c();
    			}

    			t21 = space();
    			div22 = element("div");
    			div21 = element("div");
    			div20 = element("div");
    			div5 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Add Fireall Rule";
    			t23 = space();
    			button0 = element("button");
    			span7 = element("span");
    			span7.textContent = "×";
    			t25 = space();
    			div18 = element("div");
    			form0 = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "FW Type";
    			t27 = space();
    			select0 = element("select");
    			option0 = element("option");

    			for (let i = 0; i < each_blocks_23.length; i += 1) {
    				each_blocks_23[i].c();
    			}

    			t28 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Context";
    			t30 = space();
    			select1 = element("select");
    			option1 = element("option");

    			for (let i = 0; i < each_blocks_22.length; i += 1) {
    				each_blocks_22[i].c();
    			}

    			t31 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Source";
    			t33 = space();
    			select2 = element("select");
    			option2 = element("option");
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_21.length; i += 1) {
    				each_blocks_21[i].c();
    			}

    			optgroup1 = element("optgroup");

    			for (let i = 0; i < each_blocks_20.length; i += 1) {
    				each_blocks_20[i].c();
    			}

    			optgroup2 = element("optgroup");

    			for (let i = 0; i < each_blocks_19.length; i += 1) {
    				each_blocks_19[i].c();
    			}

    			optgroup3 = element("optgroup");

    			for (let i = 0; i < each_blocks_18.length; i += 1) {
    				each_blocks_18[i].c();
    			}

    			t34 = space();
    			div13 = element("div");
    			div12 = element("div");
    			label3 = element("label");
    			label3.textContent = "Destination";
    			t36 = space();
    			select3 = element("select");
    			option3 = element("option");
    			optgroup4 = element("optgroup");

    			for (let i = 0; i < each_blocks_17.length; i += 1) {
    				each_blocks_17[i].c();
    			}

    			optgroup5 = element("optgroup");

    			for (let i = 0; i < each_blocks_16.length; i += 1) {
    				each_blocks_16[i].c();
    			}

    			optgroup6 = element("optgroup");

    			for (let i = 0; i < each_blocks_15.length; i += 1) {
    				each_blocks_15[i].c();
    			}

    			optgroup7 = element("optgroup");

    			for (let i = 0; i < each_blocks_14.length; i += 1) {
    				each_blocks_14[i].c();
    			}

    			t37 = space();
    			div15 = element("div");
    			div14 = element("div");
    			label4 = element("label");
    			label4.textContent = "Service Group Object";
    			t39 = space();
    			select4 = element("select");
    			option4 = element("option");

    			for (let i = 0; i < each_blocks_13.length; i += 1) {
    				each_blocks_13[i].c();
    			}

    			t40 = space();
    			div17 = element("div");
    			div16 = element("div");
    			label5 = element("label");
    			label5.textContent = "Use Case";
    			t42 = space();
    			select5 = element("select");
    			option5 = element("option");

    			for (let i = 0; i < each_blocks_12.length; i += 1) {
    				each_blocks_12[i].c();
    			}

    			t43 = space();
    			div19 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close";
    			t45 = space();
    			button2 = element("button");
    			button2.textContent = "Add";
    			t47 = space();
    			div42 = element("div");
    			div41 = element("div");
    			div40 = element("div");
    			div23 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Edit Fireall Rule";
    			t49 = space();
    			button3 = element("button");
    			span8 = element("span");
    			span8.textContent = "×";
    			t51 = space();
    			div38 = element("div");
    			form1 = element("form");
    			div25 = element("div");
    			div24 = element("div");
    			label6 = element("label");
    			label6.textContent = "Id";
    			t53 = space();
    			input0 = element("input");
    			t54 = space();
    			div27 = element("div");
    			div26 = element("div");
    			label7 = element("label");
    			label7.textContent = "FW Type";
    			t56 = space();
    			select6 = element("select");
    			option6 = element("option");

    			for (let i = 0; i < each_blocks_11.length; i += 1) {
    				each_blocks_11[i].c();
    			}

    			t57 = space();
    			div29 = element("div");
    			div28 = element("div");
    			label8 = element("label");
    			label8.textContent = "Context";
    			t59 = space();
    			select7 = element("select");
    			option7 = element("option");

    			for (let i = 0; i < each_blocks_10.length; i += 1) {
    				each_blocks_10[i].c();
    			}

    			t60 = space();
    			div31 = element("div");
    			div30 = element("div");
    			label9 = element("label");
    			label9.textContent = "Source";
    			t62 = space();
    			select8 = element("select");
    			option8 = element("option");
    			optgroup8 = element("optgroup");

    			for (let i = 0; i < each_blocks_9.length; i += 1) {
    				each_blocks_9[i].c();
    			}

    			optgroup9 = element("optgroup");

    			for (let i = 0; i < each_blocks_8.length; i += 1) {
    				each_blocks_8[i].c();
    			}

    			optgroup10 = element("optgroup");

    			for (let i = 0; i < each_blocks_7.length; i += 1) {
    				each_blocks_7[i].c();
    			}

    			optgroup11 = element("optgroup");

    			for (let i = 0; i < each_blocks_6.length; i += 1) {
    				each_blocks_6[i].c();
    			}

    			t63 = space();
    			div33 = element("div");
    			div32 = element("div");
    			label10 = element("label");
    			label10.textContent = "Destination";
    			t65 = space();
    			select9 = element("select");
    			option9 = element("option");
    			optgroup12 = element("optgroup");

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].c();
    			}

    			optgroup13 = element("optgroup");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			optgroup14 = element("optgroup");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			optgroup15 = element("optgroup");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t66 = space();
    			div35 = element("div");
    			div34 = element("div");
    			label11 = element("label");
    			label11.textContent = "Service Group Object";
    			t68 = space();
    			select10 = element("select");
    			option10 = element("option");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t69 = space();
    			div37 = element("div");
    			div36 = element("div");
    			label12 = element("label");
    			label12.textContent = "Use Case";
    			t71 = space();
    			select11 = element("select");
    			option11 = element("option");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t72 = space();
    			div39 = element("div");
    			button4 = element("button");
    			button4.textContent = "Close";
    			t74 = space();
    			button5 = element("button");
    			button5.textContent = "Edit";
    			t76 = space();
    			div48 = element("div");
    			div47 = element("div");
    			div46 = element("div");
    			div43 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Use-Case info";
    			t78 = space();
    			button6 = element("button");
    			span9 = element("span");
    			span9.textContent = "×";
    			t80 = space();
    			div44 = element("div");
    			h60 = element("h6");
    			strong0 = element("strong");
    			strong0.textContent = "Name:";
    			t82 = space();
    			t83 = text(t83_value);
    			t84 = space();
    			br0 = element("br");
    			t85 = space();
    			br1 = element("br");
    			t86 = space();
    			h61 = element("h6");
    			strong1 = element("strong");
    			strong1.textContent = "Description:";
    			t88 = space();
    			t89 = text(t89_value);
    			t90 = space();
    			br2 = element("br");
    			t91 = space();
    			br3 = element("br");
    			t92 = space();
    			h62 = element("h6");
    			strong2 = element("strong");
    			strong2.textContent = "Tags:";
    			t94 = space();
    			t95 = text(t95_value);
    			t96 = space();
    			br4 = element("br");
    			t97 = space();
    			br5 = element("br");
    			t98 = space();
    			div45 = element("div");
    			button7 = element("button");
    			button7.textContent = "Close";
    			t100 = space();
    			div54 = element("div");
    			div53 = element("div");
    			div52 = element("div");
    			div49 = element("div");
    			h53 = element("h5");
    			h53.textContent = "Delete Firewall-Rule";
    			t102 = space();
    			button8 = element("button");
    			span10 = element("span");
    			span10.textContent = "×";
    			t104 = space();
    			div50 = element("div");
    			t105 = text("Are you sure, that you want to delete the following Firewall Rule?\r\n        ");
    			br6 = element("br");
    			t106 = space();
    			br7 = element("br");
    			t107 = space();
    			h63 = element("h6");
    			strong3 = element("strong");
    			strong3.textContent = "FW type:";
    			t109 = space();
    			t110 = text(t110_value);
    			t111 = space();
    			br8 = element("br");
    			t112 = space();
    			br9 = element("br");
    			t113 = space();
    			h64 = element("h6");
    			strong4 = element("strong");
    			strong4.textContent = "Context:";
    			t115 = space();
    			t116 = text(t116_value);
    			t117 = space();
    			br10 = element("br");
    			t118 = space();
    			br11 = element("br");
    			t119 = space();
    			h65 = element("h6");
    			strong5 = element("strong");
    			strong5.textContent = "Source:";
    			t121 = space();
    			t122 = text(t122_value);
    			t123 = space();
    			br12 = element("br");
    			t124 = space();
    			br13 = element("br");
    			t125 = space();
    			h66 = element("h6");
    			strong6 = element("strong");
    			strong6.textContent = "Destination:";
    			t127 = space();
    			t128 = text(t128_value);
    			t129 = space();
    			br14 = element("br");
    			t130 = space();
    			br15 = element("br");
    			t131 = space();
    			h67 = element("h6");
    			strong7 = element("strong");
    			strong7.textContent = "Service Group Object:";
    			t133 = space();
    			t134 = text(t134_value);
    			t135 = space();
    			br16 = element("br");
    			t136 = space();
    			br17 = element("br");
    			t137 = space();
    			h68 = element("h6");
    			strong8 = element("strong");
    			strong8.textContent = "Use Case:";
    			t139 = space();
    			t140 = text(t140_value);
    			t141 = space();
    			br18 = element("br");
    			t142 = space();
    			br19 = element("br");
    			t143 = space();
    			div51 = element("div");
    			button9 = element("button");
    			button9.textContent = "Close";
    			t145 = space();
    			button10 = element("button");
    			button10.textContent = "Delete";
    			t147 = space();
    			div76 = element("div");
    			div75 = element("div");
    			div74 = element("div");
    			div55 = element("div");
    			h54 = element("h5");
    			h54.textContent = "Change Status of Firewall Rule";
    			t149 = space();
    			button11 = element("button");
    			span11 = element("span");
    			span11.textContent = "×";
    			t151 = space();
    			div72 = element("div");
    			form2 = element("form");
    			div57 = element("div");
    			div56 = element("div");
    			label13 = element("label");
    			label13.textContent = "Id";
    			t153 = space();
    			input1 = element("input");
    			t154 = space();
    			div59 = element("div");
    			div58 = element("div");
    			label14 = element("label");
    			label14.textContent = "FW Type";
    			t156 = space();
    			input2 = element("input");
    			t157 = space();
    			div61 = element("div");
    			div60 = element("div");
    			label15 = element("label");
    			label15.textContent = "Context";
    			t159 = space();
    			input3 = element("input");
    			t160 = space();
    			div63 = element("div");
    			div62 = element("div");
    			label16 = element("label");
    			label16.textContent = "Source";
    			t162 = space();
    			input4 = element("input");
    			t163 = space();
    			div65 = element("div");
    			div64 = element("div");
    			label17 = element("label");
    			label17.textContent = "Destination";
    			t165 = space();
    			input5 = element("input");
    			t166 = space();
    			div67 = element("div");
    			div66 = element("div");
    			label18 = element("label");
    			label18.textContent = "Service Group Object";
    			t168 = space();
    			input6 = element("input");
    			t169 = space();
    			div69 = element("div");
    			div68 = element("div");
    			label19 = element("label");
    			label19.textContent = "Use Case";
    			t171 = space();
    			input7 = element("input");
    			t172 = space();
    			div71 = element("div");
    			div70 = element("div");
    			label20 = element("label");
    			label20.textContent = "Status";
    			t174 = space();
    			select12 = element("select");
    			option12 = element("option");
    			option12.textContent = "EDITED";
    			if (if_block1) if_block1.c();
    			t176 = space();
    			div73 = element("div");
    			button12 = element("button");
    			button12.textContent = "Close";
    			t178 = space();
    			button13 = element("button");
    			button13.textContent = "Edit";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$9, 461, 8, 11761);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$9, 460, 6, 11734);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$9, 463, 6, 11851);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$9, 459, 4, 11709);
    			attr_dev(div3, "class", "container-fluid");
    			add_location(div3, file$9, 458, 2, 11674);
    			attr_dev(i0, "class", "fa fa-fw fa-sort");
    			add_location(i0, file$9, 484, 12, 12680);
    			add_location(span0, file$9, 483, 19, 12634);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$9, 482, 8, 12598);
    			attr_dev(i1, "class", "fa fa-fw fa-sort");
    			add_location(i1, file$9, 490, 12, 12903);
    			add_location(span1, file$9, 489, 19, 12856);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$9, 488, 8, 12820);
    			attr_dev(i2, "class", "fa fa-fw fa-sort");
    			add_location(i2, file$9, 496, 12, 13124);
    			add_location(span2, file$9, 495, 18, 13078);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$9, 494, 8, 13043);
    			attr_dev(i3, "class", "fa fa-fw fa-sort");
    			add_location(i3, file$9, 502, 12, 13355);
    			add_location(span3, file$9, 501, 23, 13304);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$9, 500, 8, 13264);
    			attr_dev(i4, "class", "fa fa-fw fa-sort");
    			add_location(i4, file$9, 508, 12, 13574);
    			add_location(span4, file$9, 507, 17, 13529);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$9, 506, 8, 13495);
    			attr_dev(i5, "class", "fa fa-fw fa-sort");
    			add_location(i5, file$9, 514, 12, 13798);
    			add_location(span5, file$9, 513, 20, 13751);
    			attr_dev(th5, "scope", "col");
    			add_location(th5, file$9, 512, 8, 13714);
    			attr_dev(i6, "class", "fa fa-fw fa-sort");
    			add_location(i6, file$9, 520, 12, 14027);
    			add_location(span6, file$9, 519, 18, 13973);
    			attr_dev(th6, "scope", "col");
    			add_location(th6, file$9, 518, 8, 13938);
    			attr_dev(th7, "scope", "col");
    			add_location(th7, file$9, 523, 8, 14101);
    			attr_dev(th8, "scope", "col");
    			add_location(th8, file$9, 524, 8, 14129);
    			attr_dev(th9, "scope", "col");
    			add_location(th9, file$9, 525, 8, 14157);
    			add_location(tr, file$9, 480, 6, 12518);
    			add_location(thead, file$9, 479, 4, 12503);
    			add_location(tbody, file$9, 528, 4, 14208);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allFirwallRules");
    			add_location(table, file$9, 478, 2, 12429);
    			set_style(div4, "margin-left", "-52px");
    			set_style(div4, "margin-right", "-52px");
    			add_location(div4, file$9, 457, 0, 11616);
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "createFirewallRule");
    			add_location(h50, file$9, 815, 8, 24716);
    			attr_dev(span7, "aria-hidden", "true");
    			add_location(span7, file$9, 822, 10, 24937);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$9, 816, 8, 24795);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$9, 814, 6, 24680);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "fwType");
    			add_location(label0, file$9, 830, 14, 25153);
    			option0.hidden = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$9, 836, 16, 25391);
    			attr_dev(select0, "class", "form-select");
    			attr_dev(select0, "aria-label", "fwType");
    			if (/*firewallRule*/ ctx[2].fwTypeId === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[30].call(select0));
    			add_location(select0, file$9, 831, 14, 25223);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$9, 829, 12, 25120);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$9, 828, 10, 25084);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "context");
    			add_location(label1, file$9, 845, 14, 25679);
    			option1.hidden = true;
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 851, 16, 25920);
    			attr_dev(select1, "class", "form-select");
    			attr_dev(select1, "aria-label", "context");
    			if (/*firewallRule*/ ctx[2].contextId === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[31].call(select1));
    			add_location(select1, file$9, 846, 14, 25750);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$9, 844, 12, 25646);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$9, 843, 10, 25610);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "source");
    			add_location(label2, file$9, 860, 14, 26203);
    			option2.hidden = true;
    			option2.__value = "";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 866, 16, 26440);
    			attr_dev(optgroup0, "label", "Host Objects");
    			add_location(optgroup0, file$9, 867, 16, 26475);
    			attr_dev(optgroup1, "label", "Host Group Objects");
    			add_location(optgroup1, file$9, 872, 16, 26682);
    			attr_dev(optgroup2, "label", "Network Objects");
    			add_location(optgroup2, file$9, 877, 16, 26901);
    			attr_dev(optgroup3, "label", "Network Group Objects");
    			add_location(optgroup3, file$9, 882, 16, 27114);
    			attr_dev(select2, "class", "form-select");
    			attr_dev(select2, "aria-label", "source");
    			if (/*firewallRule*/ ctx[2].sourceId === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[32].call(select2));
    			add_location(select2, file$9, 861, 14, 26272);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$9, 859, 12, 26170);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$9, 858, 10, 26134);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "destination");
    			add_location(label3, file$9, 892, 14, 27465);
    			option3.hidden = true;
    			option3.__value = "";
    			option3.value = option3.__value;
    			add_location(option3, file$9, 898, 16, 27722);
    			attr_dev(optgroup4, "label", "Host Objects");
    			add_location(optgroup4, file$9, 899, 16, 27757);
    			attr_dev(optgroup5, "label", "Host Group Objects");
    			add_location(optgroup5, file$9, 904, 16, 27964);
    			attr_dev(optgroup6, "label", "Network Objects");
    			add_location(optgroup6, file$9, 909, 16, 28183);
    			attr_dev(optgroup7, "label", "Network Group Objects");
    			add_location(optgroup7, file$9, 914, 16, 28396);
    			attr_dev(select3, "class", "form-select");
    			attr_dev(select3, "aria-label", "destination");
    			if (/*firewallRule*/ ctx[2].destinationId === void 0) add_render_callback(() => /*select3_change_handler*/ ctx[33].call(select3));
    			add_location(select3, file$9, 893, 14, 27544);
    			attr_dev(div12, "class", "col");
    			add_location(div12, file$9, 891, 12, 27432);
    			attr_dev(div13, "class", "row mb-3");
    			add_location(div13, file$9, 890, 10, 27396);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "sgo");
    			add_location(label4, file$9, 924, 14, 28747);
    			option4.hidden = true;
    			option4.__value = "";
    			option4.value = option4.__value;
    			add_location(option4, file$9, 930, 16, 29004);
    			attr_dev(select4, "class", "form-select");
    			attr_dev(select4, "aria-label", "sgo");
    			if (/*firewallRule*/ ctx[2].serviceGroupObjectId === void 0) add_render_callback(() => /*select4_change_handler*/ ctx[34].call(select4));
    			add_location(select4, file$9, 925, 14, 28827);
    			attr_dev(div14, "class", "col");
    			add_location(div14, file$9, 923, 12, 28714);
    			attr_dev(div15, "class", "row mb-3");
    			add_location(div15, file$9, 922, 10, 28678);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "uc");
    			add_location(label5, file$9, 939, 14, 29294);
    			option5.hidden = true;
    			option5.__value = "";
    			option5.value = option5.__value;
    			add_location(option5, file$9, 945, 16, 29526);
    			attr_dev(select5, "class", "form-select");
    			attr_dev(select5, "aria-label", "uc");
    			if (/*firewallRule*/ ctx[2].useCaseId === void 0) add_render_callback(() => /*select5_change_handler*/ ctx[35].call(select5));
    			add_location(select5, file$9, 940, 14, 29361);
    			attr_dev(div16, "class", "col");
    			add_location(div16, file$9, 938, 12, 29261);
    			attr_dev(div17, "class", "row mb-3");
    			add_location(div17, file$9, 937, 10, 29225);
    			attr_dev(form0, "class", "mb-5");
    			add_location(form0, file$9, 827, 8, 25053);
    			attr_dev(div18, "class", "modal-body");
    			add_location(div18, file$9, 826, 6, 25019);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-dismiss", "modal");
    			add_location(button1, file$9, 955, 8, 29803);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn");
    			set_style(button2, "background-color", "#008000");
    			set_style(button2, "color", "#fff");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$9, 958, 8, 29918);
    			attr_dev(div19, "class", "modal-footer");
    			add_location(div19, file$9, 954, 6, 29767);
    			attr_dev(div20, "class", "modal-content");
    			add_location(div20, file$9, 813, 4, 24645);
    			attr_dev(div21, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div21, "role", "document");
    			add_location(div21, file$9, 812, 2, 24575);
    			attr_dev(div22, "class", "modal fade");
    			attr_dev(div22, "id", "createFWR");
    			attr_dev(div22, "tabindex", "-1");
    			attr_dev(div22, "role", "dialog");
    			attr_dev(div22, "aria-labelledby", "formCreateFirewallRule");
    			attr_dev(div22, "aria-hidden", "true");
    			add_location(div22, file$9, 804, 0, 24424);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "editFirewallRule");
    			add_location(h51, file$9, 981, 8, 30462);
    			attr_dev(span8, "aria-hidden", "true");
    			add_location(span8, file$9, 988, 10, 30682);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "close");
    			attr_dev(button3, "data-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$9, 982, 8, 30540);
    			attr_dev(div23, "class", "modal-header");
    			add_location(div23, file$9, 980, 6, 30426);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "id");
    			add_location(label6, file$9, 995, 14, 30896);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "id");
    			attr_dev(input0, "type", "text");
    			input0.disabled = true;
    			add_location(input0, file$9, 996, 14, 30957);
    			attr_dev(div24, "class", "col");
    			add_location(div24, file$9, 994, 12, 30863);
    			attr_dev(div25, "class", "row mb-3");
    			add_location(div25, file$9, 993, 10, 30827);
    			attr_dev(label7, "class", "form-label");
    			attr_dev(label7, "for", "fwType");
    			add_location(label7, file$9, 1007, 14, 31258);
    			option6.hidden = true;
    			option6.__value = "";
    			option6.value = option6.__value;
    			add_location(option6, file$9, 1013, 16, 31490);
    			attr_dev(select6, "class", "form-select");
    			attr_dev(select6, "aria-label", "fwType");
    			if (/*fwEdit*/ ctx[12].fwTypeId === void 0) add_render_callback(() => /*select6_change_handler*/ ctx[37].call(select6));
    			add_location(select6, file$9, 1008, 14, 31328);
    			attr_dev(div26, "class", "col");
    			add_location(div26, file$9, 1006, 12, 31225);
    			attr_dev(div27, "class", "row mb-3");
    			add_location(div27, file$9, 1005, 10, 31189);
    			attr_dev(label8, "class", "form-label");
    			attr_dev(label8, "for", "context");
    			add_location(label8, file$9, 1022, 14, 31778);
    			option7.hidden = true;
    			option7.__value = "";
    			option7.value = option7.__value;
    			add_location(option7, file$9, 1028, 16, 32013);
    			attr_dev(select7, "class", "form-select");
    			attr_dev(select7, "aria-label", "context");
    			if (/*fwEdit*/ ctx[12].contextId === void 0) add_render_callback(() => /*select7_change_handler*/ ctx[38].call(select7));
    			add_location(select7, file$9, 1023, 14, 31849);
    			attr_dev(div28, "class", "col");
    			add_location(div28, file$9, 1021, 12, 31745);
    			attr_dev(div29, "class", "row mb-3");
    			add_location(div29, file$9, 1020, 10, 31709);
    			attr_dev(label9, "class", "form-label");
    			attr_dev(label9, "for", "source");
    			add_location(label9, file$9, 1037, 14, 32296);
    			option8.hidden = true;
    			option8.__value = "";
    			option8.value = option8.__value;
    			add_location(option8, file$9, 1043, 16, 32527);
    			attr_dev(optgroup8, "label", "Host Objects");
    			add_location(optgroup8, file$9, 1044, 16, 32562);
    			attr_dev(optgroup9, "label", "Host Group Objects");
    			add_location(optgroup9, file$9, 1049, 16, 32769);
    			attr_dev(optgroup10, "label", "Network Objects");
    			add_location(optgroup10, file$9, 1054, 16, 32988);
    			attr_dev(optgroup11, "label", "Network Group Objects");
    			add_location(optgroup11, file$9, 1059, 16, 33201);
    			attr_dev(select8, "class", "form-select");
    			attr_dev(select8, "aria-label", "source");
    			if (/*fwEdit*/ ctx[12].sourceId === void 0) add_render_callback(() => /*select8_change_handler*/ ctx[39].call(select8));
    			add_location(select8, file$9, 1038, 14, 32365);
    			attr_dev(div30, "class", "col");
    			add_location(div30, file$9, 1036, 12, 32263);
    			attr_dev(div31, "class", "row mb-3");
    			add_location(div31, file$9, 1035, 10, 32227);
    			attr_dev(label10, "class", "form-label");
    			attr_dev(label10, "for", "destination");
    			add_location(label10, file$9, 1069, 14, 33552);
    			option9.hidden = true;
    			option9.__value = "";
    			option9.value = option9.__value;
    			add_location(option9, file$9, 1075, 16, 33803);
    			attr_dev(optgroup12, "label", "Host Objects");
    			add_location(optgroup12, file$9, 1076, 16, 33838);
    			attr_dev(optgroup13, "label", "Host Group Objects");
    			add_location(optgroup13, file$9, 1081, 16, 34045);
    			attr_dev(optgroup14, "label", "Network Objects");
    			add_location(optgroup14, file$9, 1086, 16, 34264);
    			attr_dev(optgroup15, "label", "Network Group Objects");
    			add_location(optgroup15, file$9, 1091, 16, 34477);
    			attr_dev(select9, "class", "form-select");
    			attr_dev(select9, "aria-label", "destination");
    			if (/*fwEdit*/ ctx[12].destinationId === void 0) add_render_callback(() => /*select9_change_handler*/ ctx[40].call(select9));
    			add_location(select9, file$9, 1070, 14, 33631);
    			attr_dev(div32, "class", "col");
    			add_location(div32, file$9, 1068, 12, 33519);
    			attr_dev(div33, "class", "row mb-3");
    			add_location(div33, file$9, 1067, 10, 33483);
    			attr_dev(label11, "class", "form-label");
    			attr_dev(label11, "for", "sgo");
    			add_location(label11, file$9, 1101, 14, 34828);
    			option10.hidden = true;
    			option10.__value = "";
    			option10.value = option10.__value;
    			add_location(option10, file$9, 1107, 16, 35079);
    			attr_dev(select10, "class", "form-select");
    			attr_dev(select10, "aria-label", "sgo");
    			if (/*fwEdit*/ ctx[12].serviceGroupObjectId === void 0) add_render_callback(() => /*select10_change_handler*/ ctx[41].call(select10));
    			add_location(select10, file$9, 1102, 14, 34908);
    			attr_dev(div34, "class", "col");
    			add_location(div34, file$9, 1100, 12, 34795);
    			attr_dev(div35, "class", "row mb-3");
    			add_location(div35, file$9, 1099, 10, 34759);
    			attr_dev(label12, "class", "form-label");
    			attr_dev(label12, "for", "uc");
    			add_location(label12, file$9, 1116, 14, 35369);
    			option11.hidden = true;
    			option11.__value = "";
    			option11.value = option11.__value;
    			add_location(option11, file$9, 1122, 16, 35595);
    			attr_dev(select11, "class", "form-select");
    			attr_dev(select11, "aria-label", "uc");
    			if (/*fwEdit*/ ctx[12].useCaseId === void 0) add_render_callback(() => /*select11_change_handler*/ ctx[42].call(select11));
    			add_location(select11, file$9, 1117, 14, 35436);
    			attr_dev(div36, "class", "col");
    			add_location(div36, file$9, 1115, 12, 35336);
    			attr_dev(div37, "class", "row mb-3");
    			add_location(div37, file$9, 1114, 10, 35300);
    			attr_dev(form1, "class", "mb-5");
    			add_location(form1, file$9, 992, 8, 30796);
    			attr_dev(div38, "class", "modal-body");
    			add_location(div38, file$9, 991, 6, 30762);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-secondary");
    			attr_dev(button4, "data-dismiss", "modal");
    			add_location(button4, file$9, 1132, 8, 35872);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			set_style(button5, "background-color", "#008000");
    			set_style(button5, "color", "#fff");
    			attr_dev(button5, "data-dismiss", "modal");
    			add_location(button5, file$9, 1135, 8, 35987);
    			attr_dev(div39, "class", "modal-footer");
    			add_location(div39, file$9, 1131, 6, 35836);
    			attr_dev(div40, "class", "modal-content");
    			add_location(div40, file$9, 979, 4, 30391);
    			attr_dev(div41, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div41, "role", "document");
    			add_location(div41, file$9, 978, 2, 30321);
    			attr_dev(div42, "class", "modal fade");
    			attr_dev(div42, "id", "editFW");
    			attr_dev(div42, "tabindex", "-1");
    			attr_dev(div42, "role", "dialog");
    			attr_dev(div42, "aria-labelledby", "formEditFirewallRule");
    			attr_dev(div42, "aria-hidden", "true");
    			add_location(div42, file$9, 970, 0, 30175);
    			attr_dev(h52, "class", "modal-title");
    			attr_dev(h52, "id", "deleteUseCase");
    			add_location(h52, file$9, 1160, 8, 36535);
    			attr_dev(span9, "aria-hidden", "true");
    			add_location(span9, file$9, 1167, 10, 36748);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "close");
    			attr_dev(button6, "data-dismiss", "modal");
    			attr_dev(button6, "aria-label", "Close");
    			add_location(button6, file$9, 1161, 8, 36606);
    			attr_dev(div43, "class", "modal-header");
    			add_location(div43, file$9, 1159, 6, 36499);
    			add_location(strong0, file$9, 1171, 12, 36866);
    			add_location(h60, file$9, 1171, 8, 36862);
    			add_location(br0, file$9, 1173, 8, 36927);
    			add_location(br1, file$9, 1174, 8, 36943);
    			add_location(strong1, file$9, 1175, 12, 36963);
    			add_location(h61, file$9, 1175, 8, 36959);
    			add_location(br2, file$9, 1177, 8, 37038);
    			add_location(br3, file$9, 1178, 8, 37054);
    			add_location(strong2, file$9, 1179, 12, 37074);
    			add_location(h62, file$9, 1179, 8, 37070);
    			add_location(br4, file$9, 1181, 8, 37135);
    			add_location(br5, file$9, 1182, 8, 37151);
    			attr_dev(div44, "class", "modal-body");
    			add_location(div44, file$9, 1170, 6, 36828);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-secondary");
    			attr_dev(button7, "data-dismiss", "modal");
    			add_location(button7, file$9, 1185, 8, 37215);
    			attr_dev(div45, "class", "modal-footer");
    			add_location(div45, file$9, 1184, 6, 37179);
    			attr_dev(div46, "class", "modal-content");
    			add_location(div46, file$9, 1158, 4, 36464);
    			attr_dev(div47, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div47, "role", "document");
    			add_location(div47, file$9, 1157, 2, 36394);
    			attr_dev(div48, "class", "modal fade");
    			attr_dev(div48, "id", "getUC");
    			attr_dev(div48, "tabindex", "-1");
    			attr_dev(div48, "role", "dialog");
    			attr_dev(div48, "aria-labelledby", "formGetUseCase");
    			attr_dev(div48, "aria-hidden", "true");
    			add_location(div48, file$9, 1149, 0, 36255);
    			attr_dev(h53, "class", "modal-title");
    			attr_dev(h53, "id", "deleteFWR");
    			add_location(h53, file$9, 1204, 8, 37651);
    			attr_dev(span10, "aria-hidden", "true");
    			add_location(span10, file$9, 1211, 10, 37867);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "close");
    			attr_dev(button8, "data-dismiss", "modal");
    			attr_dev(button8, "aria-label", "Close");
    			add_location(button8, file$9, 1205, 8, 37725);
    			attr_dev(div49, "class", "modal-header");
    			add_location(div49, file$9, 1203, 6, 37615);
    			add_location(br6, file$9, 1216, 8, 38057);
    			add_location(br7, file$9, 1217, 8, 38073);
    			add_location(strong3, file$9, 1218, 12, 38093);
    			add_location(h63, file$9, 1218, 8, 38089);
    			add_location(br8, file$9, 1220, 8, 38165);
    			add_location(br9, file$9, 1221, 8, 38181);
    			add_location(strong4, file$9, 1222, 12, 38201);
    			add_location(h64, file$9, 1222, 8, 38197);
    			add_location(br10, file$9, 1224, 8, 38274);
    			add_location(br11, file$9, 1225, 8, 38290);
    			add_location(strong5, file$9, 1226, 12, 38310);
    			add_location(h65, file$9, 1226, 8, 38306);
    			add_location(br12, file$9, 1228, 8, 38381);
    			add_location(br13, file$9, 1229, 8, 38397);
    			add_location(strong6, file$9, 1230, 12, 38417);
    			add_location(h66, file$9, 1230, 8, 38413);
    			add_location(br14, file$9, 1232, 8, 38499);
    			add_location(br15, file$9, 1233, 8, 38515);
    			add_location(strong7, file$9, 1234, 12, 38535);
    			add_location(h67, file$9, 1234, 8, 38531);
    			add_location(br16, file$9, 1236, 8, 38632);
    			add_location(br17, file$9, 1237, 8, 38648);
    			add_location(strong8, file$9, 1238, 12, 38668);
    			add_location(h68, file$9, 1238, 8, 38664);
    			add_location(br18, file$9, 1240, 8, 38742);
    			add_location(br19, file$9, 1241, 8, 38758);
    			attr_dev(div50, "class", "modal-body");
    			add_location(div50, file$9, 1214, 6, 37947);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn btn-secondary");
    			attr_dev(button9, "data-dismiss", "modal");
    			add_location(button9, file$9, 1244, 8, 38822);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "btn");
    			attr_dev(button10, "data-dismiss", "modal");
    			set_style(button10, "background-color", "#c73834");
    			set_style(button10, "color", "#fff");
    			add_location(button10, file$9, 1247, 8, 38937);
    			attr_dev(div51, "class", "modal-footer");
    			add_location(div51, file$9, 1243, 6, 38786);
    			attr_dev(div52, "class", "modal-content");
    			add_location(div52, file$9, 1202, 4, 37580);
    			attr_dev(div53, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div53, "role", "document");
    			add_location(div53, file$9, 1201, 2, 37510);
    			attr_dev(div54, "class", "modal fade");
    			attr_dev(div54, "id", "deleteFWR");
    			attr_dev(div54, "tabindex", "-1");
    			attr_dev(div54, "role", "dialog");
    			attr_dev(div54, "aria-labelledby", "formDeleteFWR");
    			attr_dev(div54, "aria-hidden", "true");
    			add_location(div54, file$9, 1193, 0, 37368);
    			attr_dev(h54, "class", "modal-title");
    			attr_dev(h54, "id", "changeStatusOfFW");
    			add_location(h54, file$9, 1272, 8, 39550);
    			attr_dev(span11, "aria-hidden", "true");
    			add_location(span11, file$9, 1281, 10, 39805);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "close");
    			attr_dev(button11, "data-dismiss", "modal");
    			attr_dev(button11, "aria-label", "Close");
    			add_location(button11, file$9, 1275, 8, 39663);
    			attr_dev(div55, "class", "modal-header");
    			add_location(div55, file$9, 1271, 6, 39514);
    			attr_dev(label13, "class", "form-label");
    			attr_dev(label13, "for", "id");
    			add_location(label13, file$9, 1288, 14, 40019);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "id");
    			attr_dev(input1, "type", "text");
    			input1.disabled = true;
    			add_location(input1, file$9, 1289, 14, 40080);
    			attr_dev(div56, "class", "col");
    			add_location(div56, file$9, 1287, 12, 39986);
    			attr_dev(div57, "class", "row mb-3");
    			add_location(div57, file$9, 1286, 10, 39950);
    			attr_dev(label14, "class", "form-label");
    			attr_dev(label14, "for", "fwType");
    			add_location(label14, file$9, 1300, 14, 40384);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "id");
    			attr_dev(input2, "type", "text");
    			input2.disabled = true;
    			add_location(input2, file$9, 1301, 14, 40454);
    			attr_dev(div58, "class", "col");
    			add_location(div58, file$9, 1299, 12, 40351);
    			attr_dev(div59, "class", "row mb-3");
    			add_location(div59, file$9, 1298, 10, 40315);
    			attr_dev(label15, "class", "form-label");
    			attr_dev(label15, "for", "context");
    			add_location(label15, file$9, 1312, 14, 40766);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "id");
    			attr_dev(input3, "type", "text");
    			input3.disabled = true;
    			add_location(input3, file$9, 1313, 14, 40837);
    			attr_dev(div60, "class", "col");
    			add_location(div60, file$9, 1311, 12, 40733);
    			attr_dev(div61, "class", "row mb-3");
    			add_location(div61, file$9, 1310, 10, 40697);
    			attr_dev(label16, "class", "form-label");
    			attr_dev(label16, "for", "source");
    			add_location(label16, file$9, 1324, 14, 41150);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "id");
    			attr_dev(input4, "type", "text");
    			input4.disabled = true;
    			add_location(input4, file$9, 1325, 14, 41219);
    			attr_dev(div62, "class", "col");
    			add_location(div62, file$9, 1323, 12, 41117);
    			attr_dev(div63, "class", "row mb-3");
    			add_location(div63, file$9, 1322, 10, 41081);
    			attr_dev(label17, "class", "form-label");
    			attr_dev(label17, "for", "destination");
    			add_location(label17, file$9, 1336, 14, 41531);
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "id", "id");
    			attr_dev(input5, "type", "text");
    			input5.disabled = true;
    			add_location(input5, file$9, 1337, 14, 41610);
    			attr_dev(div64, "class", "col");
    			add_location(div64, file$9, 1335, 12, 41498);
    			attr_dev(div65, "class", "row mb-3");
    			add_location(div65, file$9, 1334, 10, 41462);
    			attr_dev(label18, "class", "form-label");
    			attr_dev(label18, "for", "sgo");
    			add_location(label18, file$9, 1348, 14, 41928);
    			attr_dev(input6, "class", "form-control");
    			attr_dev(input6, "id", "id");
    			attr_dev(input6, "type", "text");
    			input6.disabled = true;
    			add_location(input6, file$9, 1349, 14, 42008);
    			attr_dev(div66, "class", "col");
    			add_location(div66, file$9, 1347, 12, 41895);
    			attr_dev(div67, "class", "row mb-3");
    			add_location(div67, file$9, 1346, 10, 41859);
    			attr_dev(label19, "class", "form-label");
    			attr_dev(label19, "for", "uc");
    			add_location(label19, file$9, 1360, 14, 42332);
    			attr_dev(input7, "class", "form-control");
    			attr_dev(input7, "id", "id");
    			attr_dev(input7, "type", "text");
    			input7.disabled = true;
    			add_location(input7, file$9, 1361, 14, 42399);
    			attr_dev(div68, "class", "col");
    			add_location(div68, file$9, 1359, 12, 42299);
    			attr_dev(div69, "class", "row mb-3");
    			add_location(div69, file$9, 1358, 10, 42263);
    			attr_dev(label20, "class", "form-label");
    			attr_dev(label20, "for", "uc");
    			add_location(label20, file$9, 1372, 14, 42712);
    			option12.__value = "EDITED";
    			option12.value = option12.__value;
    			option12.hidden = true;
    			add_location(option12, file$9, 1378, 16, 42940);
    			attr_dev(select12, "class", "form-select");
    			attr_dev(select12, "aria-label", "status");
    			if (/*fwrStatus*/ ctx[14].status === void 0) add_render_callback(() => /*select12_change_handler*/ ctx[50].call(select12));
    			add_location(select12, file$9, 1373, 14, 42777);
    			attr_dev(div70, "class", "col");
    			add_location(div70, file$9, 1371, 12, 42679);
    			attr_dev(div71, "class", "row mb-3");
    			add_location(div71, file$9, 1370, 10, 42643);
    			attr_dev(form2, "class", "mb-5");
    			add_location(form2, file$9, 1285, 8, 39919);
    			attr_dev(div72, "class", "modal-body");
    			add_location(div72, file$9, 1284, 6, 39885);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "btn btn-secondary");
    			attr_dev(button12, "data-dismiss", "modal");
    			add_location(button12, file$9, 1419, 8, 45642);
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "class", "btn");
    			set_style(button13, "background-color", "#008000");
    			set_style(button13, "color", "#fff");
    			attr_dev(button13, "data-dismiss", "modal");
    			add_location(button13, file$9, 1422, 8, 45757);
    			attr_dev(div73, "class", "modal-footer");
    			add_location(div73, file$9, 1418, 6, 45606);
    			attr_dev(div74, "class", "modal-content");
    			add_location(div74, file$9, 1270, 4, 39479);
    			attr_dev(div75, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div75, "role", "document");
    			add_location(div75, file$9, 1269, 2, 39409);
    			attr_dev(div76, "class", "modal fade");
    			attr_dev(div76, "id", "changeStatusOfFW");
    			attr_dev(div76, "tabindex", "-1");
    			attr_dev(div76, "role", "dialog");
    			attr_dev(div76, "aria-labelledby", "formChangeStatusOfFW");
    			attr_dev(div76, "aria-hidden", "true");
    			add_location(div76, file$9, 1261, 0, 39253);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div4, t3);
    			append_dev(div4, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t4);
    			append_dev(th0, span0);
    			append_dev(span0, i0);
    			append_dev(tr, t5);
    			append_dev(tr, th1);
    			append_dev(th1, t6);
    			append_dev(th1, span1);
    			append_dev(span1, i1);
    			append_dev(tr, t7);
    			append_dev(tr, th2);
    			append_dev(th2, t8);
    			append_dev(th2, span2);
    			append_dev(span2, i2);
    			append_dev(tr, t9);
    			append_dev(tr, th3);
    			append_dev(th3, t10);
    			append_dev(th3, span3);
    			append_dev(span3, i3);
    			append_dev(tr, t11);
    			append_dev(tr, th4);
    			append_dev(th4, t12);
    			append_dev(th4, span4);
    			append_dev(span4, i4);
    			append_dev(tr, t13);
    			append_dev(tr, th5);
    			append_dev(th5, t14);
    			append_dev(th5, span5);
    			append_dev(span5, i5);
    			append_dev(tr, t15);
    			append_dev(tr, th6);
    			append_dev(th6, t16);
    			append_dev(th6, span6);
    			append_dev(span6, i6);
    			append_dev(tr, t17);
    			append_dev(tr, th7);
    			append_dev(tr, t18);
    			append_dev(tr, th8);
    			append_dev(tr, t19);
    			append_dev(tr, th9);
    			append_dev(table, t20);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_24.length; i += 1) {
    				each_blocks_24[i].m(tbody, null);
    			}

    			insert_dev(target, t21, anchor);
    			insert_dev(target, div22, anchor);
    			append_dev(div22, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div5);
    			append_dev(div5, h50);
    			append_dev(div5, t23);
    			append_dev(div5, button0);
    			append_dev(button0, span7);
    			append_dev(div20, t25);
    			append_dev(div20, div18);
    			append_dev(div18, form0);
    			append_dev(form0, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t27);
    			append_dev(div6, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_23.length; i += 1) {
    				each_blocks_23[i].m(select0, null);
    			}

    			select_option(select0, /*firewallRule*/ ctx[2].fwTypeId);
    			append_dev(form0, t28);
    			append_dev(form0, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t30);
    			append_dev(div8, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks_22.length; i += 1) {
    				each_blocks_22[i].m(select1, null);
    			}

    			select_option(select1, /*firewallRule*/ ctx[2].contextId);
    			append_dev(form0, t31);
    			append_dev(form0, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t33);
    			append_dev(div10, select2);
    			append_dev(select2, option2);
    			append_dev(select2, optgroup0);

    			for (let i = 0; i < each_blocks_21.length; i += 1) {
    				each_blocks_21[i].m(optgroup0, null);
    			}

    			append_dev(select2, optgroup1);

    			for (let i = 0; i < each_blocks_20.length; i += 1) {
    				each_blocks_20[i].m(optgroup1, null);
    			}

    			append_dev(select2, optgroup2);

    			for (let i = 0; i < each_blocks_19.length; i += 1) {
    				each_blocks_19[i].m(optgroup2, null);
    			}

    			append_dev(select2, optgroup3);

    			for (let i = 0; i < each_blocks_18.length; i += 1) {
    				each_blocks_18[i].m(optgroup3, null);
    			}

    			select_option(select2, /*firewallRule*/ ctx[2].sourceId);
    			append_dev(form0, t34);
    			append_dev(form0, div13);
    			append_dev(div13, div12);
    			append_dev(div12, label3);
    			append_dev(div12, t36);
    			append_dev(div12, select3);
    			append_dev(select3, option3);
    			append_dev(select3, optgroup4);

    			for (let i = 0; i < each_blocks_17.length; i += 1) {
    				each_blocks_17[i].m(optgroup4, null);
    			}

    			append_dev(select3, optgroup5);

    			for (let i = 0; i < each_blocks_16.length; i += 1) {
    				each_blocks_16[i].m(optgroup5, null);
    			}

    			append_dev(select3, optgroup6);

    			for (let i = 0; i < each_blocks_15.length; i += 1) {
    				each_blocks_15[i].m(optgroup6, null);
    			}

    			append_dev(select3, optgroup7);

    			for (let i = 0; i < each_blocks_14.length; i += 1) {
    				each_blocks_14[i].m(optgroup7, null);
    			}

    			select_option(select3, /*firewallRule*/ ctx[2].destinationId);
    			append_dev(form0, t37);
    			append_dev(form0, div15);
    			append_dev(div15, div14);
    			append_dev(div14, label4);
    			append_dev(div14, t39);
    			append_dev(div14, select4);
    			append_dev(select4, option4);

    			for (let i = 0; i < each_blocks_13.length; i += 1) {
    				each_blocks_13[i].m(select4, null);
    			}

    			select_option(select4, /*firewallRule*/ ctx[2].serviceGroupObjectId);
    			append_dev(form0, t40);
    			append_dev(form0, div17);
    			append_dev(div17, div16);
    			append_dev(div16, label5);
    			append_dev(div16, t42);
    			append_dev(div16, select5);
    			append_dev(select5, option5);

    			for (let i = 0; i < each_blocks_12.length; i += 1) {
    				each_blocks_12[i].m(select5, null);
    			}

    			select_option(select5, /*firewallRule*/ ctx[2].useCaseId);
    			append_dev(div20, t43);
    			append_dev(div20, div19);
    			append_dev(div19, button1);
    			append_dev(div19, t45);
    			append_dev(div19, button2);
    			insert_dev(target, t47, anchor);
    			insert_dev(target, div42, anchor);
    			append_dev(div42, div41);
    			append_dev(div41, div40);
    			append_dev(div40, div23);
    			append_dev(div23, h51);
    			append_dev(div23, t49);
    			append_dev(div23, button3);
    			append_dev(button3, span8);
    			append_dev(div40, t51);
    			append_dev(div40, div38);
    			append_dev(div38, form1);
    			append_dev(form1, div25);
    			append_dev(div25, div24);
    			append_dev(div24, label6);
    			append_dev(div24, t53);
    			append_dev(div24, input0);
    			set_input_value(input0, /*fwEdit*/ ctx[12].id);
    			append_dev(form1, t54);
    			append_dev(form1, div27);
    			append_dev(div27, div26);
    			append_dev(div26, label7);
    			append_dev(div26, t56);
    			append_dev(div26, select6);
    			append_dev(select6, option6);

    			for (let i = 0; i < each_blocks_11.length; i += 1) {
    				each_blocks_11[i].m(select6, null);
    			}

    			select_option(select6, /*fwEdit*/ ctx[12].fwTypeId);
    			append_dev(form1, t57);
    			append_dev(form1, div29);
    			append_dev(div29, div28);
    			append_dev(div28, label8);
    			append_dev(div28, t59);
    			append_dev(div28, select7);
    			append_dev(select7, option7);

    			for (let i = 0; i < each_blocks_10.length; i += 1) {
    				each_blocks_10[i].m(select7, null);
    			}

    			select_option(select7, /*fwEdit*/ ctx[12].contextId);
    			append_dev(form1, t60);
    			append_dev(form1, div31);
    			append_dev(div31, div30);
    			append_dev(div30, label9);
    			append_dev(div30, t62);
    			append_dev(div30, select8);
    			append_dev(select8, option8);
    			append_dev(select8, optgroup8);

    			for (let i = 0; i < each_blocks_9.length; i += 1) {
    				each_blocks_9[i].m(optgroup8, null);
    			}

    			append_dev(select8, optgroup9);

    			for (let i = 0; i < each_blocks_8.length; i += 1) {
    				each_blocks_8[i].m(optgroup9, null);
    			}

    			append_dev(select8, optgroup10);

    			for (let i = 0; i < each_blocks_7.length; i += 1) {
    				each_blocks_7[i].m(optgroup10, null);
    			}

    			append_dev(select8, optgroup11);

    			for (let i = 0; i < each_blocks_6.length; i += 1) {
    				each_blocks_6[i].m(optgroup11, null);
    			}

    			select_option(select8, /*fwEdit*/ ctx[12].sourceId);
    			append_dev(form1, t63);
    			append_dev(form1, div33);
    			append_dev(div33, div32);
    			append_dev(div32, label10);
    			append_dev(div32, t65);
    			append_dev(div32, select9);
    			append_dev(select9, option9);
    			append_dev(select9, optgroup12);

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].m(optgroup12, null);
    			}

    			append_dev(select9, optgroup13);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(optgroup13, null);
    			}

    			append_dev(select9, optgroup14);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(optgroup14, null);
    			}

    			append_dev(select9, optgroup15);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(optgroup15, null);
    			}

    			select_option(select9, /*fwEdit*/ ctx[12].destinationId);
    			append_dev(form1, t66);
    			append_dev(form1, div35);
    			append_dev(div35, div34);
    			append_dev(div34, label11);
    			append_dev(div34, t68);
    			append_dev(div34, select10);
    			append_dev(select10, option10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select10, null);
    			}

    			select_option(select10, /*fwEdit*/ ctx[12].serviceGroupObjectId);
    			append_dev(form1, t69);
    			append_dev(form1, div37);
    			append_dev(div37, div36);
    			append_dev(div36, label12);
    			append_dev(div36, t71);
    			append_dev(div36, select11);
    			append_dev(select11, option11);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select11, null);
    			}

    			select_option(select11, /*fwEdit*/ ctx[12].useCaseId);
    			append_dev(div40, t72);
    			append_dev(div40, div39);
    			append_dev(div39, button4);
    			append_dev(div39, t74);
    			append_dev(div39, button5);
    			insert_dev(target, t76, anchor);
    			insert_dev(target, div48, anchor);
    			append_dev(div48, div47);
    			append_dev(div47, div46);
    			append_dev(div46, div43);
    			append_dev(div43, h52);
    			append_dev(div43, t78);
    			append_dev(div43, button6);
    			append_dev(button6, span9);
    			append_dev(div46, t80);
    			append_dev(div46, div44);
    			append_dev(div44, h60);
    			append_dev(h60, strong0);
    			append_dev(div44, t82);
    			append_dev(div44, t83);
    			append_dev(div44, t84);
    			append_dev(div44, br0);
    			append_dev(div44, t85);
    			append_dev(div44, br1);
    			append_dev(div44, t86);
    			append_dev(div44, h61);
    			append_dev(h61, strong1);
    			append_dev(div44, t88);
    			append_dev(div44, t89);
    			append_dev(div44, t90);
    			append_dev(div44, br2);
    			append_dev(div44, t91);
    			append_dev(div44, br3);
    			append_dev(div44, t92);
    			append_dev(div44, h62);
    			append_dev(h62, strong2);
    			append_dev(div44, t94);
    			append_dev(div44, t95);
    			append_dev(div44, t96);
    			append_dev(div44, br4);
    			append_dev(div44, t97);
    			append_dev(div44, br5);
    			append_dev(div46, t98);
    			append_dev(div46, div45);
    			append_dev(div45, button7);
    			insert_dev(target, t100, anchor);
    			insert_dev(target, div54, anchor);
    			append_dev(div54, div53);
    			append_dev(div53, div52);
    			append_dev(div52, div49);
    			append_dev(div49, h53);
    			append_dev(div49, t102);
    			append_dev(div49, button8);
    			append_dev(button8, span10);
    			append_dev(div52, t104);
    			append_dev(div52, div50);
    			append_dev(div50, t105);
    			append_dev(div50, br6);
    			append_dev(div50, t106);
    			append_dev(div50, br7);
    			append_dev(div50, t107);
    			append_dev(div50, h63);
    			append_dev(h63, strong3);
    			append_dev(div50, t109);
    			append_dev(div50, t110);
    			append_dev(div50, t111);
    			append_dev(div50, br8);
    			append_dev(div50, t112);
    			append_dev(div50, br9);
    			append_dev(div50, t113);
    			append_dev(div50, h64);
    			append_dev(h64, strong4);
    			append_dev(div50, t115);
    			append_dev(div50, t116);
    			append_dev(div50, t117);
    			append_dev(div50, br10);
    			append_dev(div50, t118);
    			append_dev(div50, br11);
    			append_dev(div50, t119);
    			append_dev(div50, h65);
    			append_dev(h65, strong5);
    			append_dev(div50, t121);
    			append_dev(div50, t122);
    			append_dev(div50, t123);
    			append_dev(div50, br12);
    			append_dev(div50, t124);
    			append_dev(div50, br13);
    			append_dev(div50, t125);
    			append_dev(div50, h66);
    			append_dev(h66, strong6);
    			append_dev(div50, t127);
    			append_dev(div50, t128);
    			append_dev(div50, t129);
    			append_dev(div50, br14);
    			append_dev(div50, t130);
    			append_dev(div50, br15);
    			append_dev(div50, t131);
    			append_dev(div50, h67);
    			append_dev(h67, strong7);
    			append_dev(div50, t133);
    			append_dev(div50, t134);
    			append_dev(div50, t135);
    			append_dev(div50, br16);
    			append_dev(div50, t136);
    			append_dev(div50, br17);
    			append_dev(div50, t137);
    			append_dev(div50, h68);
    			append_dev(h68, strong8);
    			append_dev(div50, t139);
    			append_dev(div50, t140);
    			append_dev(div50, t141);
    			append_dev(div50, br18);
    			append_dev(div50, t142);
    			append_dev(div50, br19);
    			append_dev(div52, t143);
    			append_dev(div52, div51);
    			append_dev(div51, button9);
    			append_dev(div51, t145);
    			append_dev(div51, button10);
    			insert_dev(target, t147, anchor);
    			insert_dev(target, div76, anchor);
    			append_dev(div76, div75);
    			append_dev(div75, div74);
    			append_dev(div74, div55);
    			append_dev(div55, h54);
    			append_dev(div55, t149);
    			append_dev(div55, button11);
    			append_dev(button11, span11);
    			append_dev(div74, t151);
    			append_dev(div74, div72);
    			append_dev(div72, form2);
    			append_dev(form2, div57);
    			append_dev(div57, div56);
    			append_dev(div56, label13);
    			append_dev(div56, t153);
    			append_dev(div56, input1);
    			set_input_value(input1, /*fwrStatus*/ ctx[14].id);
    			append_dev(form2, t154);
    			append_dev(form2, div59);
    			append_dev(div59, div58);
    			append_dev(div58, label14);
    			append_dev(div58, t156);
    			append_dev(div58, input2);
    			set_input_value(input2, /*fwrStatus*/ ctx[14].fwTypeName);
    			append_dev(form2, t157);
    			append_dev(form2, div61);
    			append_dev(div61, div60);
    			append_dev(div60, label15);
    			append_dev(div60, t159);
    			append_dev(div60, input3);
    			set_input_value(input3, /*fwrStatus*/ ctx[14].contextName);
    			append_dev(form2, t160);
    			append_dev(form2, div63);
    			append_dev(div63, div62);
    			append_dev(div62, label16);
    			append_dev(div62, t162);
    			append_dev(div62, input4);
    			set_input_value(input4, /*fwrStatus*/ ctx[14].sourceName);
    			append_dev(form2, t163);
    			append_dev(form2, div65);
    			append_dev(div65, div64);
    			append_dev(div64, label17);
    			append_dev(div64, t165);
    			append_dev(div64, input5);
    			set_input_value(input5, /*fwrStatus*/ ctx[14].destionationName);
    			append_dev(form2, t166);
    			append_dev(form2, div67);
    			append_dev(div67, div66);
    			append_dev(div66, label18);
    			append_dev(div66, t168);
    			append_dev(div66, input6);
    			set_input_value(input6, /*fwrStatus*/ ctx[14].serviceGroupObjectName);
    			append_dev(form2, t169);
    			append_dev(form2, div69);
    			append_dev(div69, div68);
    			append_dev(div68, label19);
    			append_dev(div68, t171);
    			append_dev(div68, input7);
    			set_input_value(input7, /*fwrStatus*/ ctx[14].useCaseName);
    			append_dev(form2, t172);
    			append_dev(form2, div71);
    			append_dev(div71, div70);
    			append_dev(div70, label20);
    			append_dev(div70, t174);
    			append_dev(div70, select12);
    			append_dev(select12, option12);
    			if (if_block1) if_block1.m(select12, null);
    			select_option(select12, /*fwrStatus*/ ctx[14].status);
    			append_dev(div74, t176);
    			append_dev(div74, div73);
    			append_dev(div73, button12);
    			append_dev(div73, t178);
    			append_dev(div73, button13);

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
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[30]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[31]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[32]),
    					listen_dev(select3, "change", /*select3_change_handler*/ ctx[33]),
    					listen_dev(select4, "change", /*select4_change_handler*/ ctx[34]),
    					listen_dev(select5, "change", /*select5_change_handler*/ ctx[35]),
    					listen_dev(button2, "click", /*createFirewallRule*/ ctx[18], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[36]),
    					listen_dev(select6, "change", /*select6_change_handler*/ ctx[37]),
    					listen_dev(select7, "change", /*select7_change_handler*/ ctx[38]),
    					listen_dev(select8, "change", /*select8_change_handler*/ ctx[39]),
    					listen_dev(select9, "change", /*select9_change_handler*/ ctx[40]),
    					listen_dev(select10, "change", /*select10_change_handler*/ ctx[41]),
    					listen_dev(select11, "change", /*select11_change_handler*/ ctx[42]),
    					listen_dev(button5, "click", /*editFw*/ ctx[20], false, false, false),
    					listen_dev(
    						button10,
    						"click",
    						function () {
    							if (is_function(/*deleteFwr*/ ctx[22](/*fwrDelete*/ ctx[13].id))) /*deleteFwr*/ ctx[22](/*fwrDelete*/ ctx[13].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[43]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[44]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[45]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[46]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[47]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[48]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[49]),
    					listen_dev(select12, "change", /*select12_change_handler*/ ctx[50]),
    					listen_dev(button13, "click", /*changeFwStatus*/ ctx[24], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$isAuthenticated, $user*/ 98304) show_if_6 = /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[16] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("helpdesk");

    			if (show_if_6) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_17(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*getFwrToDelete, firewallRules, getFwToEdit, $isAuthenticated, $user, getFwToChangeStatus, getusecase*/ 11239425) {
    				each_value_24 = /*firewallRules*/ ctx[0];
    				validate_each_argument(each_value_24);
    				let i;

    				for (i = 0; i < each_value_24.length; i += 1) {
    					const child_ctx = get_each_context_24(ctx, each_value_24, i);

    					if (each_blocks_24[i]) {
    						each_blocks_24[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_24[i] = create_each_block_24(child_ctx);
    						each_blocks_24[i].c();
    						each_blocks_24[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks_24.length; i += 1) {
    					each_blocks_24[i].d(1);
    				}

    				each_blocks_24.length = each_value_24.length;
    			}

    			if (dirty[0] & /*fwTypes*/ 8) {
    				each_value_23 = /*fwTypes*/ ctx[3];
    				validate_each_argument(each_value_23);
    				let i;

    				for (i = 0; i < each_value_23.length; i += 1) {
    					const child_ctx = get_each_context_23(ctx, each_value_23, i);

    					if (each_blocks_23[i]) {
    						each_blocks_23[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_23[i] = create_each_block_23(child_ctx);
    						each_blocks_23[i].c();
    						each_blocks_23[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_23.length; i += 1) {
    					each_blocks_23[i].d(1);
    				}

    				each_blocks_23.length = each_value_23.length;
    			}

    			if (dirty[0] & /*firewallRule, fwTypes*/ 12) {
    				select_option(select0, /*firewallRule*/ ctx[2].fwTypeId);
    			}

    			if (dirty[0] & /*contexts*/ 16) {
    				each_value_22 = /*contexts*/ ctx[4];
    				validate_each_argument(each_value_22);
    				let i;

    				for (i = 0; i < each_value_22.length; i += 1) {
    					const child_ctx = get_each_context_22(ctx, each_value_22, i);

    					if (each_blocks_22[i]) {
    						each_blocks_22[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_22[i] = create_each_block_22(child_ctx);
    						each_blocks_22[i].c();
    						each_blocks_22[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_22.length; i += 1) {
    					each_blocks_22[i].d(1);
    				}

    				each_blocks_22.length = each_value_22.length;
    			}

    			if (dirty[0] & /*firewallRule, fwTypes*/ 12) {
    				select_option(select1, /*firewallRule*/ ctx[2].contextId);
    			}

    			if (dirty[0] & /*hostOs*/ 32) {
    				each_value_21 = /*hostOs*/ ctx[5];
    				validate_each_argument(each_value_21);
    				let i;

    				for (i = 0; i < each_value_21.length; i += 1) {
    					const child_ctx = get_each_context_21(ctx, each_value_21, i);

    					if (each_blocks_21[i]) {
    						each_blocks_21[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_21[i] = create_each_block_21(child_ctx);
    						each_blocks_21[i].c();
    						each_blocks_21[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_21.length; i += 1) {
    					each_blocks_21[i].d(1);
    				}

    				each_blocks_21.length = each_value_21.length;
    			}

    			if (dirty[0] & /*hostGs*/ 64) {
    				each_value_20 = /*hostGs*/ ctx[6];
    				validate_each_argument(each_value_20);
    				let i;

    				for (i = 0; i < each_value_20.length; i += 1) {
    					const child_ctx = get_each_context_20(ctx, each_value_20, i);

    					if (each_blocks_20[i]) {
    						each_blocks_20[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_20[i] = create_each_block_20(child_ctx);
    						each_blocks_20[i].c();
    						each_blocks_20[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks_20.length; i += 1) {
    					each_blocks_20[i].d(1);
    				}

    				each_blocks_20.length = each_value_20.length;
    			}

    			if (dirty[0] & /*networkOs*/ 128) {
    				each_value_19 = /*networkOs*/ ctx[7];
    				validate_each_argument(each_value_19);
    				let i;

    				for (i = 0; i < each_value_19.length; i += 1) {
    					const child_ctx = get_each_context_19(ctx, each_value_19, i);

    					if (each_blocks_19[i]) {
    						each_blocks_19[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_19[i] = create_each_block_19(child_ctx);
    						each_blocks_19[i].c();
    						each_blocks_19[i].m(optgroup2, null);
    					}
    				}

    				for (; i < each_blocks_19.length; i += 1) {
    					each_blocks_19[i].d(1);
    				}

    				each_blocks_19.length = each_value_19.length;
    			}

    			if (dirty[0] & /*networkGs*/ 256) {
    				each_value_18 = /*networkGs*/ ctx[8];
    				validate_each_argument(each_value_18);
    				let i;

    				for (i = 0; i < each_value_18.length; i += 1) {
    					const child_ctx = get_each_context_18(ctx, each_value_18, i);

    					if (each_blocks_18[i]) {
    						each_blocks_18[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_18[i] = create_each_block_18(child_ctx);
    						each_blocks_18[i].c();
    						each_blocks_18[i].m(optgroup3, null);
    					}
    				}

    				for (; i < each_blocks_18.length; i += 1) {
    					each_blocks_18[i].d(1);
    				}

    				each_blocks_18.length = each_value_18.length;
    			}

    			if (dirty[0] & /*firewallRule, fwTypes*/ 12) {
    				select_option(select2, /*firewallRule*/ ctx[2].sourceId);
    			}

    			if (dirty[0] & /*hostOs*/ 32) {
    				each_value_17 = /*hostOs*/ ctx[5];
    				validate_each_argument(each_value_17);
    				let i;

    				for (i = 0; i < each_value_17.length; i += 1) {
    					const child_ctx = get_each_context_17(ctx, each_value_17, i);

    					if (each_blocks_17[i]) {
    						each_blocks_17[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_17[i] = create_each_block_17(child_ctx);
    						each_blocks_17[i].c();
    						each_blocks_17[i].m(optgroup4, null);
    					}
    				}

    				for (; i < each_blocks_17.length; i += 1) {
    					each_blocks_17[i].d(1);
    				}

    				each_blocks_17.length = each_value_17.length;
    			}

    			if (dirty[0] & /*hostGs*/ 64) {
    				each_value_16 = /*hostGs*/ ctx[6];
    				validate_each_argument(each_value_16);
    				let i;

    				for (i = 0; i < each_value_16.length; i += 1) {
    					const child_ctx = get_each_context_16(ctx, each_value_16, i);

    					if (each_blocks_16[i]) {
    						each_blocks_16[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_16[i] = create_each_block_16(child_ctx);
    						each_blocks_16[i].c();
    						each_blocks_16[i].m(optgroup5, null);
    					}
    				}

    				for (; i < each_blocks_16.length; i += 1) {
    					each_blocks_16[i].d(1);
    				}

    				each_blocks_16.length = each_value_16.length;
    			}

    			if (dirty[0] & /*networkOs*/ 128) {
    				each_value_15 = /*networkOs*/ ctx[7];
    				validate_each_argument(each_value_15);
    				let i;

    				for (i = 0; i < each_value_15.length; i += 1) {
    					const child_ctx = get_each_context_15(ctx, each_value_15, i);

    					if (each_blocks_15[i]) {
    						each_blocks_15[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_15[i] = create_each_block_15(child_ctx);
    						each_blocks_15[i].c();
    						each_blocks_15[i].m(optgroup6, null);
    					}
    				}

    				for (; i < each_blocks_15.length; i += 1) {
    					each_blocks_15[i].d(1);
    				}

    				each_blocks_15.length = each_value_15.length;
    			}

    			if (dirty[0] & /*networkGs*/ 256) {
    				each_value_14 = /*networkGs*/ ctx[8];
    				validate_each_argument(each_value_14);
    				let i;

    				for (i = 0; i < each_value_14.length; i += 1) {
    					const child_ctx = get_each_context_14(ctx, each_value_14, i);

    					if (each_blocks_14[i]) {
    						each_blocks_14[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_14[i] = create_each_block_14(child_ctx);
    						each_blocks_14[i].c();
    						each_blocks_14[i].m(optgroup7, null);
    					}
    				}

    				for (; i < each_blocks_14.length; i += 1) {
    					each_blocks_14[i].d(1);
    				}

    				each_blocks_14.length = each_value_14.length;
    			}

    			if (dirty[0] & /*firewallRule, fwTypes*/ 12) {
    				select_option(select3, /*firewallRule*/ ctx[2].destinationId);
    			}

    			if (dirty[0] & /*serviceGs*/ 512) {
    				each_value_13 = /*serviceGs*/ ctx[9];
    				validate_each_argument(each_value_13);
    				let i;

    				for (i = 0; i < each_value_13.length; i += 1) {
    					const child_ctx = get_each_context_13(ctx, each_value_13, i);

    					if (each_blocks_13[i]) {
    						each_blocks_13[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_13[i] = create_each_block_13(child_ctx);
    						each_blocks_13[i].c();
    						each_blocks_13[i].m(select4, null);
    					}
    				}

    				for (; i < each_blocks_13.length; i += 1) {
    					each_blocks_13[i].d(1);
    				}

    				each_blocks_13.length = each_value_13.length;
    			}

    			if (dirty[0] & /*firewallRule, fwTypes*/ 12) {
    				select_option(select4, /*firewallRule*/ ctx[2].serviceGroupObjectId);
    			}

    			if (dirty[0] & /*usecases*/ 1024) {
    				each_value_12 = /*usecases*/ ctx[10];
    				validate_each_argument(each_value_12);
    				let i;

    				for (i = 0; i < each_value_12.length; i += 1) {
    					const child_ctx = get_each_context_12(ctx, each_value_12, i);

    					if (each_blocks_12[i]) {
    						each_blocks_12[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_12[i] = create_each_block_12(child_ctx);
    						each_blocks_12[i].c();
    						each_blocks_12[i].m(select5, null);
    					}
    				}

    				for (; i < each_blocks_12.length; i += 1) {
    					each_blocks_12[i].d(1);
    				}

    				each_blocks_12.length = each_value_12.length;
    			}

    			if (dirty[0] & /*firewallRule, fwTypes*/ 12) {
    				select_option(select5, /*firewallRule*/ ctx[2].useCaseId);
    			}

    			if (dirty[0] & /*fwEdit, fwTypes*/ 4104 && input0.value !== /*fwEdit*/ ctx[12].id) {
    				set_input_value(input0, /*fwEdit*/ ctx[12].id);
    			}

    			if (dirty[0] & /*fwTypes*/ 8) {
    				each_value_11 = /*fwTypes*/ ctx[3];
    				validate_each_argument(each_value_11);
    				let i;

    				for (i = 0; i < each_value_11.length; i += 1) {
    					const child_ctx = get_each_context_11(ctx, each_value_11, i);

    					if (each_blocks_11[i]) {
    						each_blocks_11[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_11[i] = create_each_block_11(child_ctx);
    						each_blocks_11[i].c();
    						each_blocks_11[i].m(select6, null);
    					}
    				}

    				for (; i < each_blocks_11.length; i += 1) {
    					each_blocks_11[i].d(1);
    				}

    				each_blocks_11.length = each_value_11.length;
    			}

    			if (dirty[0] & /*fwEdit, fwTypes*/ 4104) {
    				select_option(select6, /*fwEdit*/ ctx[12].fwTypeId);
    			}

    			if (dirty[0] & /*contexts*/ 16) {
    				each_value_10 = /*contexts*/ ctx[4];
    				validate_each_argument(each_value_10);
    				let i;

    				for (i = 0; i < each_value_10.length; i += 1) {
    					const child_ctx = get_each_context_10(ctx, each_value_10, i);

    					if (each_blocks_10[i]) {
    						each_blocks_10[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_10[i] = create_each_block_10(child_ctx);
    						each_blocks_10[i].c();
    						each_blocks_10[i].m(select7, null);
    					}
    				}

    				for (; i < each_blocks_10.length; i += 1) {
    					each_blocks_10[i].d(1);
    				}

    				each_blocks_10.length = each_value_10.length;
    			}

    			if (dirty[0] & /*fwEdit, fwTypes*/ 4104) {
    				select_option(select7, /*fwEdit*/ ctx[12].contextId);
    			}

    			if (dirty[0] & /*hostOs*/ 32) {
    				each_value_9 = /*hostOs*/ ctx[5];
    				validate_each_argument(each_value_9);
    				let i;

    				for (i = 0; i < each_value_9.length; i += 1) {
    					const child_ctx = get_each_context_9(ctx, each_value_9, i);

    					if (each_blocks_9[i]) {
    						each_blocks_9[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_9[i] = create_each_block_9(child_ctx);
    						each_blocks_9[i].c();
    						each_blocks_9[i].m(optgroup8, null);
    					}
    				}

    				for (; i < each_blocks_9.length; i += 1) {
    					each_blocks_9[i].d(1);
    				}

    				each_blocks_9.length = each_value_9.length;
    			}

    			if (dirty[0] & /*hostGs*/ 64) {
    				each_value_8 = /*hostGs*/ ctx[6];
    				validate_each_argument(each_value_8);
    				let i;

    				for (i = 0; i < each_value_8.length; i += 1) {
    					const child_ctx = get_each_context_8(ctx, each_value_8, i);

    					if (each_blocks_8[i]) {
    						each_blocks_8[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_8[i] = create_each_block_8(child_ctx);
    						each_blocks_8[i].c();
    						each_blocks_8[i].m(optgroup9, null);
    					}
    				}

    				for (; i < each_blocks_8.length; i += 1) {
    					each_blocks_8[i].d(1);
    				}

    				each_blocks_8.length = each_value_8.length;
    			}

    			if (dirty[0] & /*networkOs*/ 128) {
    				each_value_7 = /*networkOs*/ ctx[7];
    				validate_each_argument(each_value_7);
    				let i;

    				for (i = 0; i < each_value_7.length; i += 1) {
    					const child_ctx = get_each_context_7(ctx, each_value_7, i);

    					if (each_blocks_7[i]) {
    						each_blocks_7[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_7[i] = create_each_block_7(child_ctx);
    						each_blocks_7[i].c();
    						each_blocks_7[i].m(optgroup10, null);
    					}
    				}

    				for (; i < each_blocks_7.length; i += 1) {
    					each_blocks_7[i].d(1);
    				}

    				each_blocks_7.length = each_value_7.length;
    			}

    			if (dirty[0] & /*networkGs*/ 256) {
    				each_value_6 = /*networkGs*/ ctx[8];
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks_6[i]) {
    						each_blocks_6[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_6[i] = create_each_block_6(child_ctx);
    						each_blocks_6[i].c();
    						each_blocks_6[i].m(optgroup11, null);
    					}
    				}

    				for (; i < each_blocks_6.length; i += 1) {
    					each_blocks_6[i].d(1);
    				}

    				each_blocks_6.length = each_value_6.length;
    			}

    			if (dirty[0] & /*fwEdit, fwTypes*/ 4104) {
    				select_option(select8, /*fwEdit*/ ctx[12].sourceId);
    			}

    			if (dirty[0] & /*hostOs*/ 32) {
    				each_value_5 = /*hostOs*/ ctx[5];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_5[i]) {
    						each_blocks_5[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_5[i] = create_each_block_5(child_ctx);
    						each_blocks_5[i].c();
    						each_blocks_5[i].m(optgroup12, null);
    					}
    				}

    				for (; i < each_blocks_5.length; i += 1) {
    					each_blocks_5[i].d(1);
    				}

    				each_blocks_5.length = each_value_5.length;
    			}

    			if (dirty[0] & /*hostGs*/ 64) {
    				each_value_4 = /*hostGs*/ ctx[6];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_4$1(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(optgroup13, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_4.length;
    			}

    			if (dirty[0] & /*networkOs*/ 128) {
    				each_value_3 = /*networkOs*/ ctx[7];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3$3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(optgroup14, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty[0] & /*networkGs*/ 256) {
    				each_value_2 = /*networkGs*/ ctx[8];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$3(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(optgroup15, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*fwEdit, fwTypes*/ 4104) {
    				select_option(select9, /*fwEdit*/ ctx[12].destinationId);
    			}

    			if (dirty[0] & /*serviceGs*/ 512) {
    				each_value_1 = /*serviceGs*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$5(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$5(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select10, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*fwEdit, fwTypes*/ 4104) {
    				select_option(select10, /*fwEdit*/ ctx[12].serviceGroupObjectId);
    			}

    			if (dirty[0] & /*usecases*/ 1024) {
    				each_value = /*usecases*/ ctx[10];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select11, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*fwEdit, fwTypes*/ 4104) {
    				select_option(select11, /*fwEdit*/ ctx[12].useCaseId);
    			}

    			if (dirty[0] & /*usecase*/ 2048 && t83_value !== (t83_value = /*usecase*/ ctx[11].name + "")) set_data_dev(t83, t83_value);
    			if (dirty[0] & /*usecase*/ 2048 && t89_value !== (t89_value = /*usecase*/ ctx[11].description + "")) set_data_dev(t89, t89_value);
    			if (dirty[0] & /*usecase*/ 2048 && t95_value !== (t95_value = /*usecase*/ ctx[11].tags + "")) set_data_dev(t95, t95_value);
    			if (dirty[0] & /*fwrDelete*/ 8192 && t110_value !== (t110_value = /*fwrDelete*/ ctx[13].fwTypeName + "")) set_data_dev(t110, t110_value);
    			if (dirty[0] & /*fwrDelete*/ 8192 && t116_value !== (t116_value = /*fwrDelete*/ ctx[13].contextName + "")) set_data_dev(t116, t116_value);
    			if (dirty[0] & /*fwrDelete*/ 8192 && t122_value !== (t122_value = /*fwrDelete*/ ctx[13].sourceName + "")) set_data_dev(t122, t122_value);
    			if (dirty[0] & /*fwrDelete*/ 8192 && t128_value !== (t128_value = /*fwrDelete*/ ctx[13].destionationName + "")) set_data_dev(t128, t128_value);
    			if (dirty[0] & /*fwrDelete*/ 8192 && t134_value !== (t134_value = /*fwrDelete*/ ctx[13].serviceGroupObjectName + "")) set_data_dev(t134, t134_value);
    			if (dirty[0] & /*fwrDelete*/ 8192 && t140_value !== (t140_value = /*fwrDelete*/ ctx[13].useCaseName + "")) set_data_dev(t140, t140_value);

    			if (dirty[0] & /*fwrStatus*/ 16384 && input1.value !== /*fwrStatus*/ ctx[14].id) {
    				set_input_value(input1, /*fwrStatus*/ ctx[14].id);
    			}

    			if (dirty[0] & /*fwrStatus*/ 16384 && input2.value !== /*fwrStatus*/ ctx[14].fwTypeName) {
    				set_input_value(input2, /*fwrStatus*/ ctx[14].fwTypeName);
    			}

    			if (dirty[0] & /*fwrStatus*/ 16384 && input3.value !== /*fwrStatus*/ ctx[14].contextName) {
    				set_input_value(input3, /*fwrStatus*/ ctx[14].contextName);
    			}

    			if (dirty[0] & /*fwrStatus*/ 16384 && input4.value !== /*fwrStatus*/ ctx[14].sourceName) {
    				set_input_value(input4, /*fwrStatus*/ ctx[14].sourceName);
    			}

    			if (dirty[0] & /*fwrStatus*/ 16384 && input5.value !== /*fwrStatus*/ ctx[14].destionationName) {
    				set_input_value(input5, /*fwrStatus*/ ctx[14].destionationName);
    			}

    			if (dirty[0] & /*fwrStatus*/ 16384 && input6.value !== /*fwrStatus*/ ctx[14].serviceGroupObjectName) {
    				set_input_value(input6, /*fwrStatus*/ ctx[14].serviceGroupObjectName);
    			}

    			if (dirty[0] & /*fwrStatus*/ 16384 && input7.value !== /*fwrStatus*/ ctx[14].useCaseName) {
    				set_input_value(input7, /*fwrStatus*/ ctx[14].useCaseName);
    			}

    			if (current_block_type !== (current_block_type = select_block_type_2(ctx, dirty))) {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(select12, null);
    				}
    			}

    			if (dirty[0] & /*fwrStatus*/ 16384) {
    				select_option(select12, /*fwrStatus*/ ctx[14].status);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_24, detaching);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div22);
    			destroy_each(each_blocks_23, detaching);
    			destroy_each(each_blocks_22, detaching);
    			destroy_each(each_blocks_21, detaching);
    			destroy_each(each_blocks_20, detaching);
    			destroy_each(each_blocks_19, detaching);
    			destroy_each(each_blocks_18, detaching);
    			destroy_each(each_blocks_17, detaching);
    			destroy_each(each_blocks_16, detaching);
    			destroy_each(each_blocks_15, detaching);
    			destroy_each(each_blocks_14, detaching);
    			destroy_each(each_blocks_13, detaching);
    			destroy_each(each_blocks_12, detaching);
    			if (detaching) detach_dev(t47);
    			if (detaching) detach_dev(div42);
    			destroy_each(each_blocks_11, detaching);
    			destroy_each(each_blocks_10, detaching);
    			destroy_each(each_blocks_9, detaching);
    			destroy_each(each_blocks_8, detaching);
    			destroy_each(each_blocks_7, detaching);
    			destroy_each(each_blocks_6, detaching);
    			destroy_each(each_blocks_5, detaching);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t76);
    			if (detaching) detach_dev(div48);
    			if (detaching) detach_dev(t100);
    			if (detaching) detach_dev(div54);
    			if (detaching) detach_dev(t147);
    			if (detaching) detach_dev(div76);

    			if (if_block1) {
    				if_block1.d();
    			}

    			mounted = false;
    			run_all(dispose);
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

    function instance$9($$self, $$props, $$invalidate) {
    	let sort;
    	let $jwt_token;
    	let $user;
    	let $isAuthenticated;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(52, $jwt_token = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(15, $user = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(16, $isAuthenticated = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Firewall_Rules', slots, []);
    	const api_root = window.location.origin + "/api";

    	//-----------------------------
    	let firewallRules = [];

    	let firewallRule = {
    		fwTypeId: null,
    		contextId: null,
    		sourceId: null,
    		destinationId: null,
    		serviceGroupObjectId: null,
    		useCaseId: null,
    		userMail: null
    	};

    	let fwTypes = [];
    	let contexts = [];
    	let hostOs = [];
    	let hostGs = [];
    	let networkOs = [];
    	let networkGs = [];
    	let serviceGs = [];
    	let usecases = [];

    	let usecase = {
    		name: null,
    		description: null,
    		tags: null
    	};

    	let fwEdit = {
    		id: null,
    		fwTypeId: null,
    		contextId: null,
    		sourceId: null,
    		destinationId: null,
    		serviceGroupObjectId: null,
    		useCaseId: null,
    		firewallStatus: null
    	};

    	let fwrDelete = {
    		id: null,
    		fwTypeName: null,
    		contextName: null,
    		sourceName: null,
    		destionationName: null,
    		serviceGroupObjectName: null,
    		useCaseName: null
    	};

    	let fwStatusToChange = { fwId: null, status: null, userMail: null };

    	let fwrStatus = {
    		id: null,
    		fwTypeName: null,
    		contextName: null,
    		sourceName: null,
    		destionationName: null,
    		serviceGroupObjectName: null,
    		useCaseName: null,
    		status: null,
    		userMail: null
    	};

    	function getusecase(uc) {
    		$$invalidate(11, usecase.name = uc.name, usecase);
    		$$invalidate(11, usecase.description = uc.description, usecase);
    		$$invalidate(11, usecase.tags = uc.tags, usecase);
    	}

    	function getFirewallRules() {
    		var config = {
    			method: "get",
    			url: api_root + "/service/findFwD",
    			headers: { Authorization: "Bearer " + $jwt_token }
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
    		$$invalidate(2, firewallRule.userMail = $user.email, firewallRule);

    		var config = {
    			method: "post",
    			url: api_root + "/firewall-rule",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: firewallRule
    		};

    		axios(config).then(function (response) {
    			getFirewallRules();
    		}).catch(function (error) {
    			alert("Could not create Firewall Rules");
    			console.log(error);
    		});

    		$$invalidate(2, firewallRule = {
    			fwTypeId: null,
    			contextId: null,
    			sourceId: null,
    			destinationId: null,
    			serviceGroupObjectId: null,
    			useCaseId: null,
    			userMail: null
    		});
    	}

    	//-----------------------------
    	//-----------fwTypes------------------------------
    	function getfwTypes() {
    		var config = {
    			method: "get",
    			url: api_root + "/firewall-type",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(3, fwTypes = response.data);
    		}).catch(function (error) {
    			console.log(error);
    		});
    	}

    	getfwTypes();

    	//-----------------------------------------------
    	//-----------contexts------------------------------
    	function getcontexts() {
    		var config = {
    			method: "get",
    			url: api_root + "/context",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(4, contexts = response.data);
    		}).catch(function (error) {
    			
    		});
    	}

    	getcontexts();

    	//-----------------------------------------------
    	//-----------hostOs------------------------------
    	function getHostOs() {
    		var config = {
    			method: "get",
    			url: api_root + "/host-object",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(5, hostOs = response.data);
    		}).catch(function (error) {
    			console.log(error);
    		});
    	}

    	getHostOs();

    	//-----------------------------------------------
    	//-----------hostGs------------------------------
    	function getHostGs() {
    		var config = {
    			method: "get",
    			url: api_root + "/service/findHo",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(6, hostGs = response.data);
    		}).catch(function (error) {
    			console.log(error);
    		});
    	}

    	getHostGs();

    	//-----------------------------------------------
    	//-----------networkOs------------------------------
    	function getNetworkOs() {
    		var config = {
    			method: "get",
    			url: api_root + "/network-object",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(7, networkOs = response.data);
    		}).catch(function (error) {
    			console.log(error);
    		});
    	}

    	getNetworkOs();

    	//-----------------------------------------------
    	//-----------networkGs------------------------------
    	function getNetworkGs() {
    		var config = {
    			method: "get",
    			url: api_root + "/service/findNo",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(8, networkGs = response.data);
    		}).catch(function (error) {
    			console.log(error);
    		});
    	}

    	getNetworkGs();

    	//-----------------------------------------------
    	//-----------serviceGs------------------------------
    	function getServiceGs() {
    		var config = {
    			method: "get",
    			url: api_root + "/service-group-object",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(9, serviceGs = response.data);
    		}).catch(function (error) {
    			console.log(error);
    		});
    	}

    	getServiceGs();

    	//-----------------------------------------------
    	//-----------usecases------------------------------
    	function getUseCases() {
    		var config = {
    			method: "get",
    			url: api_root + "/use-case",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(10, usecases = response.data);
    		}).catch(function (error) {
    			console.log(error);
    		});
    	}

    	getUseCases();

    	//-----------------------------------------------
    	function getFwToEdit(fw) {
    		$$invalidate(12, fwEdit.id = fw.fwId, fwEdit);
    		$$invalidate(12, fwEdit.fwTypeId = fw.fwType.id, fwEdit);
    		$$invalidate(12, fwEdit.contextId = fw.context.id, fwEdit);

    		if (fw.sNgoWithNo) {
    			$$invalidate(12, fwEdit.sourceId = fw.sNgoWithNo.ngoId, fwEdit);
    		} else if (fw.sNo) {
    			$$invalidate(12, fwEdit.sourceId = fw.sNo.id, fwEdit);
    		} else if (fw.sHgoWithHo) {
    			$$invalidate(12, fwEdit.sourceId = fw.sHgoWithHo.hgoId, fwEdit);
    		} else if (fw.sHo) {
    			$$invalidate(12, fwEdit.sourceId = fw.sHo.id, fwEdit);
    		}

    		if (fw.dNgoWithNo) {
    			$$invalidate(12, fwEdit.destinationId = fw.dNgoWithNo.ngoId, fwEdit);
    		} else if (fw.dNo) {
    			$$invalidate(12, fwEdit.destinationId = fw.dNo.id, fwEdit);
    		} else if (fw.dHgoWithHo) {
    			$$invalidate(12, fwEdit.destinationId = fw.dHgoWithHo.hgoId, fwEdit);
    		} else if (fw.dHo) {
    			$$invalidate(12, fwEdit.destinationId = fw.dHo.id, fwEdit);
    		}

    		$$invalidate(12, fwEdit.serviceGroupObjectId = fw.sgo.id, fwEdit);
    		$$invalidate(12, fwEdit.useCaseId = fw.uc.id, fwEdit);
    		$$invalidate(12, fwEdit.firewallStatus = fw.firewallStatus, fwEdit);
    	}

    	function editFw() {
    		var config = {
    			method: "put",
    			url: api_root + "/firewall-rule",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: fwEdit
    		};

    		axios(config).then(function (response) {
    			getFirewallRules();
    		}).catch(function (error) {
    			alert("Could not edit Firewall Rule");
    			console.log(error);
    		});
    	}

    	function getFwrToDelete(fwrD) {
    		$$invalidate(13, fwrDelete.id = fwrD.fwId, fwrDelete);
    		$$invalidate(13, fwrDelete.fwTypeName = fwrD.fwType.name, fwrDelete);
    		$$invalidate(13, fwrDelete.contextName = fwrD.context.name, fwrDelete);

    		if (fwrD.sNgoWithNo) {
    			$$invalidate(13, fwrDelete.sourceName = fwrD.sNgoWithNo.ngoName, fwrDelete);
    		} else if (fwrD.sNo) {
    			$$invalidate(13, fwrDelete.sourceName = fwrD.sNo.name, fwrDelete);
    		} else if (fwrD.sHgoWithHo) {
    			$$invalidate(13, fwrDelete.sourceName = fwrD.sHgoWithHo.hgoName, fwrDelete);
    		} else if (fwrD.sHo) {
    			$$invalidate(13, fwrDelete.sourceName = fwrD.sHo.name, fwrDelete);
    		}

    		if (fwrD.dNgoWithNo) {
    			$$invalidate(13, fwrDelete.destionationName = fwrD.dNgoWithNo.ngoName, fwrDelete);
    		} else if (fwrD.dNo) {
    			$$invalidate(13, fwrDelete.destionationName = fwrD.dNo.name, fwrDelete);
    		} else if (fwrD.dHgoWithHo) {
    			$$invalidate(13, fwrDelete.destionationName = fwrD.dHgoWithHo.hgoName, fwrDelete);
    		} else if (fwrD.dHo) {
    			$$invalidate(13, fwrDelete.destionationName = fwrD.dHo.name, fwrDelete);
    		}

    		$$invalidate(13, fwrDelete.serviceGroupObjectName = fwrD.sgo.name, fwrDelete);
    		$$invalidate(13, fwrDelete.useCaseName = fwrD.uc.name, fwrDelete);
    	}

    	function deleteFwr(id) {
    		var config = {
    			method: "delete",
    			url: api_root + "/firewall-rule/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			getFirewallRules();
    		}).catch(function (error) {
    			alert("Could not delete Firewall Rule");
    			console.log(error);
    		});
    	}

    	function getFwToChangeStatus(fw) {
    		$$invalidate(14, fwrStatus.id = fw.fwId, fwrStatus);
    		$$invalidate(14, fwrStatus.fwTypeName = fw.fwType.name, fwrStatus);
    		$$invalidate(14, fwrStatus.contextName = fw.context.name, fwrStatus);

    		if (fw.sNgoWithNo) {
    			$$invalidate(14, fwrStatus.sourceName = fw.sNgoWithNo.ngoName, fwrStatus);
    		} else if (fw.sNo) {
    			$$invalidate(14, fwrStatus.sourceName = fw.sNo.name, fwrStatus);
    		} else if (fw.sHgoWithHo) {
    			$$invalidate(14, fwrStatus.sourceName = fw.sHgoWithHo.hgoName, fwrStatus);
    		} else if (fw.sHo) {
    			$$invalidate(14, fwrStatus.sourceName = fw.sHo.name, fwrStatus);
    		}

    		if (fw.dNgoWithNo) {
    			$$invalidate(14, fwrStatus.destionationName = fw.dNgoWithNo.ngoName, fwrStatus);
    		} else if (fw.dNo) {
    			$$invalidate(14, fwrStatus.destionationName = fw.dNo.name, fwrStatus);
    		} else if (fw.dHgoWithHo) {
    			$$invalidate(14, fwrStatus.destionationName = fw.dHgoWithHo.hgoName, fwrStatus);
    		} else if (fw.dHo) {
    			$$invalidate(14, fwrStatus.destionationName = fw.dHo.name, fwrStatus);
    		}

    		$$invalidate(14, fwrStatus.serviceGroupObjectName = fw.sgo.name, fwrStatus);
    		$$invalidate(14, fwrStatus.useCaseName = fw.uc.name, fwrStatus);
    		$$invalidate(14, fwrStatus.status = fw.firewallStatus, fwrStatus);
    		$$invalidate(14, fwrStatus.userMail = fw.userMail, fwrStatus);
    	}

    	function changeFwStatus() {
    		fwStatusToChange.fwId = fwrStatus.id;
    		fwStatusToChange.status = fwrStatus.status;
    		fwStatusToChange.userMail = fwrStatus.userMail;

    		var config = {
    			method: "post",
    			url: api_root + "/service/change-status",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: fwStatusToChange
    		};

    		axios(config).then(function (response) {
    			getFirewallRules();
    		}).catch(function (error) {
    			alert("Could not change Status of Firewall Rule");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "fwType", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Firewall_Rules> was created with unknown prop '${key}'`);
    	});

    	const click_handler = fwr => getusecase(fwr.uc);
    	const click_handler_1 = fwr => getFwToChangeStatus(fwr);
    	const click_handler_2 = fwr => getFwToEdit(fwr);
    	const click_handler_3 = fwr => getFwrToDelete(fwr);

    	function select0_change_handler() {
    		firewallRule.fwTypeId = select_value(this);
    		$$invalidate(2, firewallRule);
    		$$invalidate(3, fwTypes);
    	}

    	function select1_change_handler() {
    		firewallRule.contextId = select_value(this);
    		$$invalidate(2, firewallRule);
    		$$invalidate(3, fwTypes);
    	}

    	function select2_change_handler() {
    		firewallRule.sourceId = select_value(this);
    		$$invalidate(2, firewallRule);
    		$$invalidate(3, fwTypes);
    	}

    	function select3_change_handler() {
    		firewallRule.destinationId = select_value(this);
    		$$invalidate(2, firewallRule);
    		$$invalidate(3, fwTypes);
    	}

    	function select4_change_handler() {
    		firewallRule.serviceGroupObjectId = select_value(this);
    		$$invalidate(2, firewallRule);
    		$$invalidate(3, fwTypes);
    	}

    	function select5_change_handler() {
    		firewallRule.useCaseId = select_value(this);
    		$$invalidate(2, firewallRule);
    		$$invalidate(3, fwTypes);
    	}

    	function input0_input_handler() {
    		fwEdit.id = this.value;
    		$$invalidate(12, fwEdit);
    		$$invalidate(3, fwTypes);
    	}

    	function select6_change_handler() {
    		fwEdit.fwTypeId = select_value(this);
    		$$invalidate(12, fwEdit);
    		$$invalidate(3, fwTypes);
    	}

    	function select7_change_handler() {
    		fwEdit.contextId = select_value(this);
    		$$invalidate(12, fwEdit);
    		$$invalidate(3, fwTypes);
    	}

    	function select8_change_handler() {
    		fwEdit.sourceId = select_value(this);
    		$$invalidate(12, fwEdit);
    		$$invalidate(3, fwTypes);
    	}

    	function select9_change_handler() {
    		fwEdit.destinationId = select_value(this);
    		$$invalidate(12, fwEdit);
    		$$invalidate(3, fwTypes);
    	}

    	function select10_change_handler() {
    		fwEdit.serviceGroupObjectId = select_value(this);
    		$$invalidate(12, fwEdit);
    		$$invalidate(3, fwTypes);
    	}

    	function select11_change_handler() {
    		fwEdit.useCaseId = select_value(this);
    		$$invalidate(12, fwEdit);
    		$$invalidate(3, fwTypes);
    	}

    	function input1_input_handler() {
    		fwrStatus.id = this.value;
    		$$invalidate(14, fwrStatus);
    	}

    	function input2_input_handler() {
    		fwrStatus.fwTypeName = this.value;
    		$$invalidate(14, fwrStatus);
    	}

    	function input3_input_handler() {
    		fwrStatus.contextName = this.value;
    		$$invalidate(14, fwrStatus);
    	}

    	function input4_input_handler() {
    		fwrStatus.sourceName = this.value;
    		$$invalidate(14, fwrStatus);
    	}

    	function input5_input_handler() {
    		fwrStatus.destionationName = this.value;
    		$$invalidate(14, fwrStatus);
    	}

    	function input6_input_handler() {
    		fwrStatus.serviceGroupObjectName = this.value;
    		$$invalidate(14, fwrStatus);
    	}

    	function input7_input_handler() {
    		fwrStatus.useCaseName = this.value;
    		$$invalidate(14, fwrStatus);
    	}

    	function select12_change_handler() {
    		fwrStatus.status = select_value(this);
    		$$invalidate(14, fwrStatus);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		firewallRules,
    		firewallRule,
    		fwTypes,
    		contexts,
    		hostOs,
    		hostGs,
    		networkOs,
    		networkGs,
    		serviceGs,
    		usecases,
    		usecase,
    		fwEdit,
    		fwrDelete,
    		fwStatusToChange,
    		fwrStatus,
    		getusecase,
    		getFirewallRules,
    		createFirewallRule,
    		getfwTypes,
    		getcontexts,
    		getHostOs,
    		getHostGs,
    		getNetworkOs,
    		getNetworkGs,
    		getServiceGs,
    		getUseCases,
    		getFwToEdit,
    		editFw,
    		getFwrToDelete,
    		deleteFwr,
    		getFwToChangeStatus,
    		changeFwStatus,
    		sortBy,
    		sort,
    		$jwt_token,
    		$user,
    		$isAuthenticated
    	});

    	$$self.$inject_state = $$props => {
    		if ('firewallRules' in $$props) $$invalidate(0, firewallRules = $$props.firewallRules);
    		if ('firewallRule' in $$props) $$invalidate(2, firewallRule = $$props.firewallRule);
    		if ('fwTypes' in $$props) $$invalidate(3, fwTypes = $$props.fwTypes);
    		if ('contexts' in $$props) $$invalidate(4, contexts = $$props.contexts);
    		if ('hostOs' in $$props) $$invalidate(5, hostOs = $$props.hostOs);
    		if ('hostGs' in $$props) $$invalidate(6, hostGs = $$props.hostGs);
    		if ('networkOs' in $$props) $$invalidate(7, networkOs = $$props.networkOs);
    		if ('networkGs' in $$props) $$invalidate(8, networkGs = $$props.networkGs);
    		if ('serviceGs' in $$props) $$invalidate(9, serviceGs = $$props.serviceGs);
    		if ('usecases' in $$props) $$invalidate(10, usecases = $$props.usecases);
    		if ('usecase' in $$props) $$invalidate(11, usecase = $$props.usecase);
    		if ('fwEdit' in $$props) $$invalidate(12, fwEdit = $$props.fwEdit);
    		if ('fwrDelete' in $$props) $$invalidate(13, fwrDelete = $$props.fwrDelete);
    		if ('fwStatusToChange' in $$props) fwStatusToChange = $$props.fwStatusToChange;
    		if ('fwrStatus' in $$props) $$invalidate(14, fwrStatus = $$props.fwrStatus);
    		if ('sortBy' in $$props) $$invalidate(25, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*sortBy, firewallRules*/ 33554433) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(25, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(25, sortBy.col = column, sortBy);
    					$$invalidate(25, sortBy.ascending = true, sortBy);
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
    		fwTypes,
    		contexts,
    		hostOs,
    		hostGs,
    		networkOs,
    		networkGs,
    		serviceGs,
    		usecases,
    		usecase,
    		fwEdit,
    		fwrDelete,
    		fwrStatus,
    		$user,
    		$isAuthenticated,
    		getusecase,
    		createFirewallRule,
    		getFwToEdit,
    		editFw,
    		getFwrToDelete,
    		deleteFwr,
    		getFwToChangeStatus,
    		changeFwStatus,
    		sortBy,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		select0_change_handler,
    		select1_change_handler,
    		select2_change_handler,
    		select3_change_handler,
    		select4_change_handler,
    		select5_change_handler,
    		input0_input_handler,
    		select6_change_handler,
    		select7_change_handler,
    		select8_change_handler,
    		select9_change_handler,
    		select10_change_handler,
    		select11_change_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		select12_change_handler
    	];
    }

    class Firewall_Rules extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {}, null, [-1, -1, -1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Firewall_Rules",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\pages\Contexts.svelte generated by Svelte v3.53.1 */

    const { console: console_1$7 } = globals;
    const file$8 = "src\\pages\\Contexts.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (169:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_2$4(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Context";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#createC");
    			set_style(button, "margin-top", "19px");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			add_location(button, file$8, 170, 10, 3950);
    			attr_dev(div, "class", "col");
    			set_style(div, "text-align-last", "right");
    			add_location(div, file$8, 169, 8, 3889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(169:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (252:4) {:else}
    function create_else_block_1$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No data available";
    			add_location(div, file$8, 252, 6, 6536);
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
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(252:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (214:4) {#if visibleData.length}
    function create_if_block$8(ctx) {
    	let tbody;
    	let each_value = /*visibleData*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tbody, file$8, 214, 6, 5173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getCToDelete, visibleData, getCToEdit, $isAuthenticated, $user*/ 2657) {
    				each_value = /*visibleData*/ ctx[0];
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
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(214:4) {#if visibleData.length}",
    		ctx
    	});

    	return block;
    }

    // (245:12) {:else}
    function create_else_block$7(ctx) {
    	let td0;
    	let t;
    	let td1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t = space();
    			td1 = element("td");
    			add_location(td0, file$8, 245, 14, 6418);
    			add_location(td1, file$8, 246, 14, 6440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(245:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (222:12) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_1$8(ctx) {
    	let td0;
    	let button0;
    	let i0;
    	let t;
    	let td1;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[16](/*context*/ ctx[7]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[17](/*context*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t = space();
    			td1 = element("td");
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-pencil-square-o fa-lg");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$8, 228, 19, 5830);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#editC");
    			add_location(button0, file$8, 223, 17, 5608);
    			add_location(td0, file$8, 222, 14, 5586);
    			attr_dev(i1, "class", "fa fa-trash-o fa-lg");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$8, 241, 18, 6281);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#deleteC");
    			add_location(button1, file$8, 235, 17, 6037);
    			add_location(td1, file$8, 234, 14, 6015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(222:12) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (216:8) {#each visibleData as context}
    function create_each_block$7(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*context*/ ctx[7].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*context*/ ctx[7].ip + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*context*/ ctx[7].subnet + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*context*/ ctx[7].description + "";
    	let t6;
    	let t7;
    	let show_if;
    	let t8;

    	function select_block_type_1(ctx, dirty) {
    		if (dirty[0] & /*$isAuthenticated, $user*/ 96) show_if = null;
    		if (show_if == null) show_if = !!(/*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk"));
    		if (show_if) return create_if_block_1$8;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type_1(ctx, [-1, -1]);
    	let if_block = current_block_type(ctx);

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
    			if_block.c();
    			t8 = space();
    			add_location(td0, file$8, 217, 12, 5250);
    			add_location(td1, file$8, 218, 12, 5287);
    			add_location(td2, file$8, 219, 12, 5322);
    			add_location(td3, file$8, 220, 12, 5361);
    			add_location(tr, file$8, 216, 10, 5232);
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
    			if_block.m(tr, null);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*visibleData*/ 1 && t0_value !== (t0_value = /*context*/ ctx[7].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*visibleData*/ 1 && t2_value !== (t2_value = /*context*/ ctx[7].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*visibleData*/ 1 && t4_value !== (t4_value = /*context*/ ctx[7].subnet + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*visibleData*/ 1 && t6_value !== (t6_value = /*context*/ ctx[7].description + "")) set_data_dev(t6, t6_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tr, t8);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(216:8) {#each visibleData as context}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div9;
    	let div8;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let show_if = /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk");
    	let t3;
    	let div7;
    	let div3;
    	let input0;
    	let t4;
    	let div4;
    	let t5;
    	let div5;
    	let t6;
    	let div6;
    	let t7;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t8;
    	let span0;
    	let i;
    	let t9;
    	let th1;
    	let t11;
    	let th2;
    	let t13;
    	let th3;
    	let t15;
    	let th4;
    	let t16;
    	let th5;
    	let t17;
    	let t18;
    	let div23;
    	let div22;
    	let div21;
    	let div10;
    	let h50;
    	let t20;
    	let button0;
    	let span1;
    	let t22;
    	let div19;
    	let form0;
    	let div12;
    	let div11;
    	let label0;
    	let t24;
    	let input1;
    	let t25;
    	let div14;
    	let div13;
    	let label1;
    	let t27;
    	let input2;
    	let t28;
    	let div16;
    	let div15;
    	let label2;
    	let t30;
    	let input3;
    	let t31;
    	let div18;
    	let div17;
    	let label3;
    	let t33;
    	let input4;
    	let t34;
    	let div20;
    	let button1;
    	let t36;
    	let button2;
    	let t38;
    	let div39;
    	let div38;
    	let div37;
    	let div24;
    	let h51;
    	let t40;
    	let button3;
    	let span2;
    	let t42;
    	let div35;
    	let form1;
    	let div26;
    	let div25;
    	let label4;
    	let t44;
    	let input5;
    	let t45;
    	let div28;
    	let div27;
    	let label5;
    	let t47;
    	let input6;
    	let t48;
    	let div30;
    	let div29;
    	let label6;
    	let t50;
    	let input7;
    	let t51;
    	let div32;
    	let div31;
    	let label7;
    	let t53;
    	let input8;
    	let t54;
    	let div34;
    	let div33;
    	let label8;
    	let t56;
    	let input9;
    	let t57;
    	let div36;
    	let button4;
    	let t59;
    	let button5;
    	let t61;
    	let div45;
    	let div44;
    	let div43;
    	let div40;
    	let h52;
    	let t63;
    	let button6;
    	let span3;
    	let t65;
    	let div41;
    	let t66;
    	let strong;
    	let t67;
    	let t68_value = /*cDelete*/ ctx[4].name + "";
    	let t68;
    	let t69;
    	let t70;
    	let t71;
    	let div42;
    	let button7;
    	let t73;
    	let button8;
    	let mounted;
    	let dispose;
    	let if_block0 = show_if && create_if_block_2$4(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*visibleData*/ ctx[0].length) return create_if_block$8;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Contexts";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div7 = element("div");
    			div3 = element("div");
    			input0 = element("input");
    			t4 = space();
    			div4 = element("div");
    			t5 = space();
    			div5 = element("div");
    			t6 = space();
    			div6 = element("div");
    			t7 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t8 = text("Name ");
    			span0 = element("span");
    			i = element("i");
    			t9 = space();
    			th1 = element("th");
    			th1.textContent = "IP";
    			t11 = space();
    			th2 = element("th");
    			th2.textContent = "Subnet";
    			t13 = space();
    			th3 = element("th");
    			th3.textContent = "Description";
    			t15 = space();
    			th4 = element("th");
    			t16 = space();
    			th5 = element("th");
    			t17 = space();
    			if_block1.c();
    			t18 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div10 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Add Context";
    			t20 = space();
    			button0 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t22 = space();
    			div19 = element("div");
    			form0 = element("form");
    			div12 = element("div");
    			div11 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			div14 = element("div");
    			div13 = element("div");
    			label1 = element("label");
    			label1.textContent = "IP";
    			t27 = space();
    			input2 = element("input");
    			t28 = space();
    			div16 = element("div");
    			div15 = element("div");
    			label2 = element("label");
    			label2.textContent = "Subnet";
    			t30 = space();
    			input3 = element("input");
    			t31 = space();
    			div18 = element("div");
    			div17 = element("div");
    			label3 = element("label");
    			label3.textContent = "Description";
    			t33 = space();
    			input4 = element("input");
    			t34 = space();
    			div20 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close";
    			t36 = space();
    			button2 = element("button");
    			button2.textContent = "Add";
    			t38 = space();
    			div39 = element("div");
    			div38 = element("div");
    			div37 = element("div");
    			div24 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Edit Network-Object";
    			t40 = space();
    			button3 = element("button");
    			span2 = element("span");
    			span2.textContent = "×";
    			t42 = space();
    			div35 = element("div");
    			form1 = element("form");
    			div26 = element("div");
    			div25 = element("div");
    			label4 = element("label");
    			label4.textContent = "Id";
    			t44 = space();
    			input5 = element("input");
    			t45 = space();
    			div28 = element("div");
    			div27 = element("div");
    			label5 = element("label");
    			label5.textContent = "Name";
    			t47 = space();
    			input6 = element("input");
    			t48 = space();
    			div30 = element("div");
    			div29 = element("div");
    			label6 = element("label");
    			label6.textContent = "IP";
    			t50 = space();
    			input7 = element("input");
    			t51 = space();
    			div32 = element("div");
    			div31 = element("div");
    			label7 = element("label");
    			label7.textContent = "Subnet";
    			t53 = space();
    			input8 = element("input");
    			t54 = space();
    			div34 = element("div");
    			div33 = element("div");
    			label8 = element("label");
    			label8.textContent = "Description";
    			t56 = space();
    			input9 = element("input");
    			t57 = space();
    			div36 = element("div");
    			button4 = element("button");
    			button4.textContent = "Close";
    			t59 = space();
    			button5 = element("button");
    			button5.textContent = "Edit";
    			t61 = space();
    			div45 = element("div");
    			div44 = element("div");
    			div43 = element("div");
    			div40 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Delete Context";
    			t63 = space();
    			button6 = element("button");
    			span3 = element("span");
    			span3.textContent = "×";
    			t65 = space();
    			div41 = element("div");
    			t66 = text("Are you sure, that you want to delete this context ");
    			strong = element("strong");
    			t67 = text("\"");
    			t68 = text(t68_value);
    			t69 = text("\"");
    			t70 = text("?");
    			t71 = space();
    			div42 = element("div");
    			button7 = element("button");
    			button7.textContent = "Close";
    			t73 = space();
    			button8 = element("button");
    			button8.textContent = "Delete";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$8, 165, 8, 3603);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$8, 164, 6, 3576);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$8, 167, 6, 3687);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$8, 163, 4, 3551);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "search");
    			attr_dev(input0, "type", "text");
    			set_style(input0, "margin-bottom", "10px");
    			attr_dev(input0, "placeholder", "search...");
    			add_location(input0, file$8, 183, 8, 4307);
    			attr_dev(div3, "class", "col");
    			add_location(div3, file$8, 182, 6, 4280);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$8, 192, 6, 4535);
    			attr_dev(div5, "class", "col");
    			add_location(div5, file$8, 193, 6, 4562);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$8, 194, 6, 4589);
    			attr_dev(div7, "class", "row g-3");
    			add_location(div7, file$8, 181, 4, 4251);
    			attr_dev(div8, "class", "container-fluid");
    			add_location(div8, file$8, 162, 2, 3516);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$8, 203, 12, 4876);
    			add_location(span0, file$8, 202, 16, 4832);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$8, 201, 8, 4799);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$8, 206, 8, 4950);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$8, 207, 8, 4983);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$8, 208, 8, 5020);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$8, 209, 8, 5062);
    			attr_dev(th5, "scope", "col");
    			add_location(th5, file$8, 210, 8, 5090);
    			add_location(tr, file$8, 199, 6, 4719);
    			add_location(thead, file$8, 198, 4, 4704);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allContexts");
    			add_location(table, file$8, 197, 2, 4634);
    			set_style(div9, "margin-left", "-52px");
    			set_style(div9, "margin-right", "-52px");
    			add_location(div9, file$8, 161, 0, 3458);
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "crateContext");
    			add_location(h50, file$8, 268, 8, 6884);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$8, 275, 10, 7094);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$8, 269, 8, 6952);
    			attr_dev(div10, "class", "modal-header");
    			add_location(div10, file$8, 267, 6, 6848);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$8, 282, 14, 7308);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$8, 283, 14, 7373);
    			attr_dev(div11, "class", "col");
    			add_location(div11, file$8, 281, 12, 7275);
    			attr_dev(div12, "class", "row mb-3");
    			add_location(div12, file$8, 280, 10, 7239);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "ip");
    			add_location(label1, file$8, 293, 14, 7653);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "description");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$8, 294, 14, 7714);
    			attr_dev(div13, "class", "col");
    			add_location(div13, file$8, 292, 12, 7620);
    			attr_dev(div14, "class", "row mb-3");
    			add_location(div14, file$8, 291, 10, 7584);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "subnet");
    			add_location(label2, file$8, 304, 14, 7999);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "description");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$8, 305, 14, 8068);
    			attr_dev(div15, "class", "col");
    			add_location(div15, file$8, 303, 12, 7966);
    			attr_dev(div16, "class", "row mb-3");
    			add_location(div16, file$8, 302, 10, 7930);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "description");
    			add_location(label3, file$8, 315, 14, 8357);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "description");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$8, 316, 14, 8436);
    			attr_dev(div17, "class", "col");
    			add_location(div17, file$8, 314, 12, 8324);
    			attr_dev(div18, "class", "row mb-3");
    			add_location(div18, file$8, 313, 10, 8288);
    			attr_dev(form0, "class", "mb-5");
    			add_location(form0, file$8, 279, 8, 7208);
    			attr_dev(div19, "class", "modal-body");
    			add_location(div19, file$8, 278, 6, 7174);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-dismiss", "modal");
    			add_location(button1, file$8, 327, 8, 8724);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn");
    			set_style(button2, "background-color", "#008000");
    			set_style(button2, "color", "#fff");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$8, 330, 8, 8839);
    			attr_dev(div20, "class", "modal-footer");
    			add_location(div20, file$8, 326, 6, 8688);
    			attr_dev(div21, "class", "modal-content");
    			add_location(div21, file$8, 266, 4, 6813);
    			attr_dev(div22, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div22, "role", "document");
    			add_location(div22, file$8, 265, 2, 6743);
    			attr_dev(div23, "class", "modal fade");
    			attr_dev(div23, "id", "createC");
    			attr_dev(div23, "tabindex", "-1");
    			attr_dev(div23, "role", "dialog");
    			attr_dev(div23, "aria-labelledby", "formCreateContext");
    			attr_dev(div23, "aria-hidden", "true");
    			add_location(div23, file$8, 257, 0, 6599);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "editContext");
    			add_location(h51, file$8, 353, 8, 9372);
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$8, 360, 10, 9589);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "close");
    			attr_dev(button3, "data-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$8, 354, 8, 9447);
    			attr_dev(div24, "class", "modal-header");
    			add_location(div24, file$8, 352, 6, 9336);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "id");
    			add_location(label4, file$8, 367, 14, 9803);
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "id", "id");
    			attr_dev(input5, "type", "text");
    			input5.disabled = true;
    			add_location(input5, file$8, 368, 14, 9864);
    			attr_dev(div25, "class", "col");
    			add_location(div25, file$8, 366, 12, 9770);
    			attr_dev(div26, "class", "row mb-3");
    			add_location(div26, file$8, 365, 10, 9734);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "name");
    			add_location(label5, file$8, 379, 14, 10164);
    			attr_dev(input6, "class", "form-control");
    			attr_dev(input6, "id", "name");
    			attr_dev(input6, "type", "text");
    			add_location(input6, file$8, 380, 14, 10229);
    			attr_dev(div27, "class", "col");
    			add_location(div27, file$8, 378, 12, 10131);
    			attr_dev(div28, "class", "row mb-3");
    			add_location(div28, file$8, 377, 10, 10095);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "ip");
    			add_location(label6, file$8, 390, 14, 10507);
    			attr_dev(input7, "class", "form-control");
    			attr_dev(input7, "id", "ip");
    			attr_dev(input7, "type", "text");
    			add_location(input7, file$8, 391, 14, 10569);
    			attr_dev(div29, "class", "col");
    			add_location(div29, file$8, 389, 12, 10474);
    			attr_dev(div30, "class", "row mb-3");
    			add_location(div30, file$8, 388, 10, 10438);
    			attr_dev(label7, "class", "form-label");
    			attr_dev(label7, "for", "subnet");
    			add_location(label7, file$8, 401, 14, 10843);
    			attr_dev(input8, "class", "form-control");
    			attr_dev(input8, "id", "ip");
    			attr_dev(input8, "type", "text");
    			add_location(input8, file$8, 402, 14, 10913);
    			attr_dev(div31, "class", "col");
    			add_location(div31, file$8, 400, 12, 10810);
    			attr_dev(div32, "class", "row mb-3");
    			add_location(div32, file$8, 399, 10, 10774);
    			attr_dev(label8, "class", "form-label");
    			attr_dev(label8, "for", "description");
    			add_location(label8, file$8, 412, 14, 11191);
    			attr_dev(input9, "class", "form-control");
    			attr_dev(input9, "id", "description");
    			attr_dev(input9, "type", "text");
    			add_location(input9, file$8, 413, 14, 11270);
    			attr_dev(div33, "class", "col");
    			add_location(div33, file$8, 411, 12, 11158);
    			attr_dev(div34, "class", "row mb-3");
    			add_location(div34, file$8, 410, 10, 11122);
    			attr_dev(form1, "class", "mb-5");
    			add_location(form1, file$8, 364, 8, 9703);
    			attr_dev(div35, "class", "modal-body");
    			add_location(div35, file$8, 363, 6, 9669);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-secondary");
    			attr_dev(button4, "data-dismiss", "modal");
    			add_location(button4, file$8, 424, 8, 11556);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			set_style(button5, "background-color", "#008000");
    			set_style(button5, "color", "#fff");
    			attr_dev(button5, "data-dismiss", "modal");
    			add_location(button5, file$8, 427, 8, 11671);
    			attr_dev(div36, "class", "modal-footer");
    			add_location(div36, file$8, 423, 6, 11520);
    			attr_dev(div37, "class", "modal-content");
    			add_location(div37, file$8, 351, 4, 9301);
    			attr_dev(div38, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div38, "role", "document");
    			add_location(div38, file$8, 350, 2, 9231);
    			attr_dev(div39, "class", "modal fade");
    			attr_dev(div39, "id", "editC");
    			attr_dev(div39, "tabindex", "-1");
    			attr_dev(div39, "role", "dialog");
    			attr_dev(div39, "aria-labelledby", "formEditContext");
    			attr_dev(div39, "aria-hidden", "true");
    			add_location(div39, file$8, 342, 0, 9091);
    			attr_dev(h52, "class", "modal-title");
    			attr_dev(h52, "id", "deleteC");
    			add_location(h52, file$8, 450, 8, 12194);
    			attr_dev(span3, "aria-hidden", "true");
    			add_location(span3, file$8, 457, 10, 12402);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "close");
    			attr_dev(button6, "data-dismiss", "modal");
    			attr_dev(button6, "aria-label", "Close");
    			add_location(button6, file$8, 451, 8, 12260);
    			attr_dev(div40, "class", "modal-header");
    			add_location(div40, file$8, 449, 6, 12158);
    			add_location(strong, file$8, 461, 59, 12567);
    			attr_dev(div41, "class", "modal-body");
    			add_location(div41, file$8, 460, 6, 12482);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-secondary");
    			attr_dev(button7, "data-dismiss", "modal");
    			add_location(button7, file$8, 466, 8, 12681);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn");
    			attr_dev(button8, "data-dismiss", "modal");
    			set_style(button8, "background-color", "#c73834");
    			set_style(button8, "color", "#fff");
    			add_location(button8, file$8, 469, 8, 12796);
    			attr_dev(div42, "class", "modal-footer");
    			add_location(div42, file$8, 465, 6, 12645);
    			attr_dev(div43, "class", "modal-content");
    			add_location(div43, file$8, 448, 4, 12123);
    			attr_dev(div44, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div44, "role", "document");
    			add_location(div44, file$8, 447, 2, 12053);
    			attr_dev(div45, "class", "modal fade");
    			attr_dev(div45, "id", "deleteC");
    			attr_dev(div45, "tabindex", "-1");
    			attr_dev(div45, "role", "dialog");
    			attr_dev(div45, "aria-labelledby", "formDeletC");
    			attr_dev(div45, "aria-hidden", "true");
    			add_location(div45, file$8, 439, 0, 11916);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div8, t3);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*searchText*/ ctx[1]);
    			append_dev(div7, t4);
    			append_dev(div7, div4);
    			append_dev(div7, t5);
    			append_dev(div7, div5);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div9, t7);
    			append_dev(div9, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t8);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t9);
    			append_dev(tr, th1);
    			append_dev(tr, t11);
    			append_dev(tr, th2);
    			append_dev(tr, t13);
    			append_dev(tr, th3);
    			append_dev(tr, t15);
    			append_dev(tr, th4);
    			append_dev(tr, t16);
    			append_dev(tr, th5);
    			append_dev(table, t17);
    			if_block1.m(table, null);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div23, anchor);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div10);
    			append_dev(div10, h50);
    			append_dev(div10, t20);
    			append_dev(div10, button0);
    			append_dev(button0, span1);
    			append_dev(div21, t22);
    			append_dev(div21, div19);
    			append_dev(div19, form0);
    			append_dev(form0, div12);
    			append_dev(div12, div11);
    			append_dev(div11, label0);
    			append_dev(div11, t24);
    			append_dev(div11, input1);
    			set_input_value(input1, /*context*/ ctx[7].name);
    			append_dev(form0, t25);
    			append_dev(form0, div14);
    			append_dev(div14, div13);
    			append_dev(div13, label1);
    			append_dev(div13, t27);
    			append_dev(div13, input2);
    			set_input_value(input2, /*context*/ ctx[7].ip);
    			append_dev(form0, t28);
    			append_dev(form0, div16);
    			append_dev(div16, div15);
    			append_dev(div15, label2);
    			append_dev(div15, t30);
    			append_dev(div15, input3);
    			set_input_value(input3, /*context*/ ctx[7].subnet);
    			append_dev(form0, t31);
    			append_dev(form0, div18);
    			append_dev(div18, div17);
    			append_dev(div17, label3);
    			append_dev(div17, t33);
    			append_dev(div17, input4);
    			set_input_value(input4, /*context*/ ctx[7].description);
    			append_dev(div21, t34);
    			append_dev(div21, div20);
    			append_dev(div20, button1);
    			append_dev(div20, t36);
    			append_dev(div20, button2);
    			insert_dev(target, t38, anchor);
    			insert_dev(target, div39, anchor);
    			append_dev(div39, div38);
    			append_dev(div38, div37);
    			append_dev(div37, div24);
    			append_dev(div24, h51);
    			append_dev(div24, t40);
    			append_dev(div24, button3);
    			append_dev(button3, span2);
    			append_dev(div37, t42);
    			append_dev(div37, div35);
    			append_dev(div35, form1);
    			append_dev(form1, div26);
    			append_dev(div26, div25);
    			append_dev(div25, label4);
    			append_dev(div25, t44);
    			append_dev(div25, input5);
    			set_input_value(input5, /*cEdit*/ ctx[3].id);
    			append_dev(form1, t45);
    			append_dev(form1, div28);
    			append_dev(div28, div27);
    			append_dev(div27, label5);
    			append_dev(div27, t47);
    			append_dev(div27, input6);
    			set_input_value(input6, /*cEdit*/ ctx[3].name);
    			append_dev(form1, t48);
    			append_dev(form1, div30);
    			append_dev(div30, div29);
    			append_dev(div29, label6);
    			append_dev(div29, t50);
    			append_dev(div29, input7);
    			set_input_value(input7, /*cEdit*/ ctx[3].ip);
    			append_dev(form1, t51);
    			append_dev(form1, div32);
    			append_dev(div32, div31);
    			append_dev(div31, label7);
    			append_dev(div31, t53);
    			append_dev(div31, input8);
    			set_input_value(input8, /*cEdit*/ ctx[3].subnet);
    			append_dev(form1, t54);
    			append_dev(form1, div34);
    			append_dev(div34, div33);
    			append_dev(div33, label8);
    			append_dev(div33, t56);
    			append_dev(div33, input9);
    			set_input_value(input9, /*cEdit*/ ctx[3].description);
    			append_dev(div37, t57);
    			append_dev(div37, div36);
    			append_dev(div36, button4);
    			append_dev(div36, t59);
    			append_dev(div36, button5);
    			insert_dev(target, t61, anchor);
    			insert_dev(target, div45, anchor);
    			append_dev(div45, div44);
    			append_dev(div44, div43);
    			append_dev(div43, div40);
    			append_dev(div40, h52);
    			append_dev(div40, t63);
    			append_dev(div40, button6);
    			append_dev(button6, span3);
    			append_dev(div43, t65);
    			append_dev(div43, div41);
    			append_dev(div41, t66);
    			append_dev(div41, strong);
    			append_dev(strong, t67);
    			append_dev(strong, t68);
    			append_dev(strong, t69);
    			append_dev(div41, t70);
    			append_dev(div43, t71);
    			append_dev(div43, div42);
    			append_dev(div42, button7);
    			append_dev(div42, t73);
    			append_dev(div42, button8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
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
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[18]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[19]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[20]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[21]),
    					listen_dev(button2, "click", /*createContext*/ ctx[8], false, false, false),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[22]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[23]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[24]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[25]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[26]),
    					listen_dev(button5, "click", /*editC*/ ctx[10], false, false, false),
    					listen_dev(
    						button8,
    						"click",
    						function () {
    							if (is_function(/*deleteC*/ ctx[12](/*cDelete*/ ctx[4].id))) /*deleteC*/ ctx[12](/*cDelete*/ ctx[4].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$isAuthenticated, $user*/ 96) show_if = /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk");

    			if (show_if) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*searchText*/ 2 && input0.value !== /*searchText*/ ctx[1]) {
    				set_input_value(input0, /*searchText*/ ctx[1]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(table, null);
    				}
    			}

    			if (dirty[0] & /*context*/ 128 && input1.value !== /*context*/ ctx[7].name) {
    				set_input_value(input1, /*context*/ ctx[7].name);
    			}

    			if (dirty[0] & /*context*/ 128 && input2.value !== /*context*/ ctx[7].ip) {
    				set_input_value(input2, /*context*/ ctx[7].ip);
    			}

    			if (dirty[0] & /*context*/ 128 && input3.value !== /*context*/ ctx[7].subnet) {
    				set_input_value(input3, /*context*/ ctx[7].subnet);
    			}

    			if (dirty[0] & /*context*/ 128 && input4.value !== /*context*/ ctx[7].description) {
    				set_input_value(input4, /*context*/ ctx[7].description);
    			}

    			if (dirty[0] & /*cEdit*/ 8 && input5.value !== /*cEdit*/ ctx[3].id) {
    				set_input_value(input5, /*cEdit*/ ctx[3].id);
    			}

    			if (dirty[0] & /*cEdit*/ 8 && input6.value !== /*cEdit*/ ctx[3].name) {
    				set_input_value(input6, /*cEdit*/ ctx[3].name);
    			}

    			if (dirty[0] & /*cEdit*/ 8 && input7.value !== /*cEdit*/ ctx[3].ip) {
    				set_input_value(input7, /*cEdit*/ ctx[3].ip);
    			}

    			if (dirty[0] & /*cEdit*/ 8 && input8.value !== /*cEdit*/ ctx[3].subnet) {
    				set_input_value(input8, /*cEdit*/ ctx[3].subnet);
    			}

    			if (dirty[0] & /*cEdit*/ 8 && input9.value !== /*cEdit*/ ctx[3].description) {
    				set_input_value(input9, /*cEdit*/ ctx[3].description);
    			}

    			if (dirty[0] & /*cDelete*/ 16 && t68_value !== (t68_value = /*cDelete*/ ctx[4].name + "")) set_data_dev(t68, t68_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div23);
    			if (detaching) detach_dev(t38);
    			if (detaching) detach_dev(div39);
    			if (detaching) detach_dev(t61);
    			if (detaching) detach_dev(div45);
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

    function instance$8($$self, $$props, $$invalidate) {
    	let sort;
    	let $jwt_token;
    	let $isAuthenticated;
    	let $user;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(27, $jwt_token = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(5, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(6, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contexts', slots, []);
    	const api_root = window.location.origin + "/api";
    	let contexts = [];

    	let context = {
    		name: null,
    		ip: null,
    		subnet: null,
    		description: null
    	};

    	let visibleData;
    	let searchText;

    	let cEdit = {
    		id: null,
    		name: null,
    		ip: null,
    		subnet: null,
    		description: null
    	};

    	let cDelete = { id: null, name: null };

    	function getContexts() {
    		var config = {
    			method: "get",
    			url: api_root + "/context",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(13, contexts = response.data);
    		}).catch(function (error) {
    			alert("Could not get Contexts");
    			console.log(error);
    		});
    	}

    	getContexts();

    	function createContext() {
    		var config = {
    			method: "post",
    			url: api_root + "/context",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: context
    		};

    		axios(config).then(function (response) {
    			getContexts();
    		}).catch(function (error) {
    			alert("Could not create Context");
    			console.log(error);
    		});

    		$$invalidate(7, context = {
    			name: null,
    			ip: null,
    			subnet: null,
    			description: null
    		});
    	}

    	function getCToEdit(c) {
    		$$invalidate(3, cEdit.id = c.id, cEdit);
    		$$invalidate(3, cEdit.name = c.name, cEdit);
    		$$invalidate(3, cEdit.ip = c.ip, cEdit);
    		$$invalidate(3, cEdit.subnet = c.subnet, cEdit);
    		$$invalidate(3, cEdit.description = c.description, cEdit);
    	}

    	function editC() {
    		var config = {
    			method: "put",
    			url: api_root + "/context",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: cEdit
    		};

    		axios(config).then(function (response) {
    			getContexts();
    		}).catch(function (error) {
    			alert("Could not edit Context");
    			console.log(error);
    		});
    	}

    	function getCToDelete(cD) {
    		$$invalidate(4, cDelete.id = cD.id, cDelete);
    		$$invalidate(4, cDelete.name = cD.name, cDelete);
    	}

    	function deleteC(id) {
    		var config = {
    			method: "delete",
    			url: api_root + "/context/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			getContexts();
    		}).catch(function (error) {
    			alert("Could not delete Context");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Contexts> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		searchText = this.value;
    		$$invalidate(1, searchText);
    	}

    	const click_handler = context => getCToEdit(context);
    	const click_handler_1 = context => getCToDelete(context);

    	function input1_input_handler() {
    		context.name = this.value;
    		$$invalidate(7, context);
    	}

    	function input2_input_handler() {
    		context.ip = this.value;
    		$$invalidate(7, context);
    	}

    	function input3_input_handler() {
    		context.subnet = this.value;
    		$$invalidate(7, context);
    	}

    	function input4_input_handler() {
    		context.description = this.value;
    		$$invalidate(7, context);
    	}

    	function input5_input_handler() {
    		cEdit.id = this.value;
    		$$invalidate(3, cEdit);
    	}

    	function input6_input_handler() {
    		cEdit.name = this.value;
    		$$invalidate(3, cEdit);
    	}

    	function input7_input_handler() {
    		cEdit.ip = this.value;
    		$$invalidate(3, cEdit);
    	}

    	function input8_input_handler() {
    		cEdit.subnet = this.value;
    		$$invalidate(3, cEdit);
    	}

    	function input9_input_handler() {
    		cEdit.description = this.value;
    		$$invalidate(3, cEdit);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		contexts,
    		context,
    		visibleData,
    		searchText,
    		cEdit,
    		cDelete,
    		getContexts,
    		createContext,
    		getCToEdit,
    		editC,
    		getCToDelete,
    		deleteC,
    		sortBy,
    		sort,
    		$jwt_token,
    		$isAuthenticated,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('contexts' in $$props) $$invalidate(13, contexts = $$props.contexts);
    		if ('context' in $$props) $$invalidate(7, context = $$props.context);
    		if ('visibleData' in $$props) $$invalidate(0, visibleData = $$props.visibleData);
    		if ('searchText' in $$props) $$invalidate(1, searchText = $$props.searchText);
    		if ('cEdit' in $$props) $$invalidate(3, cEdit = $$props.cEdit);
    		if ('cDelete' in $$props) $$invalidate(4, cDelete = $$props.cDelete);
    		if ('sortBy' in $$props) $$invalidate(14, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(2, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*searchText, contexts*/ 8194) {
    			{
    				$$invalidate(0, visibleData = searchText
    				? contexts.filter(e => {
    						return e.name.toLowerCase().match(`${searchText.toLowerCase()}.*`) || e.ip.match(`${searchText}.*`);
    					})
    				: contexts);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*sortBy, visibleData*/ 16385) {
    			$$invalidate(2, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(14, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(14, sortBy.col = column, sortBy);
    					$$invalidate(14, sortBy.ascending = true, sortBy);
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
    		cEdit,
    		cDelete,
    		$isAuthenticated,
    		$user,
    		context,
    		createContext,
    		getCToEdit,
    		editC,
    		getCToDelete,
    		deleteC,
    		contexts,
    		sortBy,
    		input0_input_handler,
    		click_handler,
    		click_handler_1,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler
    	];
    }

    class Contexts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contexts",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\pages\Network-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$6 } = globals;
    const file$7 = "src\\pages\\Network-Objects.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (170:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_2$3(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Network-Object";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#crateHO");
    			set_style(button, "margin-top", "9px");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			add_location(button, file$7, 171, 10, 4197);
    			attr_dev(div, "class", "col");
    			set_style(div, "text-align-last", "right");
    			add_location(div, file$7, 170, 8, 4136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(170:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (259:4) {:else}
    function create_else_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No data available";
    			add_location(div, file$7, 259, 6, 7075);
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
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(259:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (221:4) {#if visibleData.length}
    function create_if_block$7(ctx) {
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

    			add_location(tbody, file$7, 221, 6, 5666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getNoToDelete, visibleData, getNoToEdit, $isAuthenticated, $user*/ 2657) {
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(221:4) {#if visibleData.length}",
    		ctx
    	});

    	return block;
    }

    // (252:12) {:else}
    function create_else_block$6(ctx) {
    	let td0;
    	let t;
    	let td1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t = space();
    			td1 = element("td");
    			add_location(td0, file$7, 252, 14, 6957);
    			add_location(td1, file$7, 253, 14, 6979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(252:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (229:12) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_1$7(ctx) {
    	let td0;
    	let button0;
    	let i0;
    	let t;
    	let td1;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[16](/*networkObject*/ ctx[7]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[17](/*networkObject*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t = space();
    			td1 = element("td");
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-pencil-square-o fa-lg");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$7, 235, 19, 6361);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#editNO");
    			add_location(button0, file$7, 230, 17, 6131);
    			add_location(td0, file$7, 229, 14, 6109);
    			attr_dev(i1, "class", "fa fa-trash-o fa-lg");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$7, 248, 18, 6820);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#deleteNO");
    			add_location(button1, file$7, 242, 17, 6568);
    			add_location(td1, file$7, 241, 14, 6546);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(229:12) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (223:8) {#each visibleData as networkObject}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*networkObject*/ ctx[7].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*networkObject*/ ctx[7].ip + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*networkObject*/ ctx[7].subnet + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*networkObject*/ ctx[7].description + "";
    	let t6;
    	let t7;
    	let show_if;
    	let t8;

    	function select_block_type_1(ctx, dirty) {
    		if (dirty[0] & /*$isAuthenticated, $user*/ 96) show_if = null;
    		if (show_if == null) show_if = !!(/*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk"));
    		if (show_if) return create_if_block_1$7;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type_1(ctx, [-1, -1]);
    	let if_block = current_block_type(ctx);

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
    			if_block.c();
    			t8 = space();
    			add_location(td0, file$7, 224, 12, 5749);
    			add_location(td1, file$7, 225, 12, 5792);
    			add_location(td2, file$7, 226, 12, 5833);
    			add_location(td3, file$7, 227, 12, 5878);
    			add_location(tr, file$7, 223, 10, 5731);
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
    			if_block.m(tr, null);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*visibleData*/ 1 && t0_value !== (t0_value = /*networkObject*/ ctx[7].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*visibleData*/ 1 && t2_value !== (t2_value = /*networkObject*/ ctx[7].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*visibleData*/ 1 && t4_value !== (t4_value = /*networkObject*/ ctx[7].subnet + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*visibleData*/ 1 && t6_value !== (t6_value = /*networkObject*/ ctx[7].description + "")) set_data_dev(t6, t6_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tr, t8);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(223:8) {#each visibleData as networkObject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div9;
    	let div8;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let show_if = /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk");
    	let t3;
    	let div7;
    	let div3;
    	let input0;
    	let t4;
    	let div4;
    	let t5;
    	let div5;
    	let t6;
    	let div6;
    	let t7;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t8;
    	let span0;
    	let i0;
    	let t9;
    	let th1;
    	let t10;
    	let i1;
    	let t11;
    	let th2;
    	let t12;
    	let i2;
    	let t13;
    	let th3;
    	let t14;
    	let i3;
    	let t15;
    	let th4;
    	let t16;
    	let th5;
    	let t17;
    	let t18;
    	let div23;
    	let div22;
    	let div21;
    	let div10;
    	let h50;
    	let t20;
    	let button0;
    	let span1;
    	let t22;
    	let div19;
    	let form0;
    	let div12;
    	let div11;
    	let label0;
    	let t24;
    	let input1;
    	let t25;
    	let div14;
    	let div13;
    	let label1;
    	let t27;
    	let input2;
    	let t28;
    	let div16;
    	let div15;
    	let label2;
    	let t30;
    	let input3;
    	let t31;
    	let div18;
    	let div17;
    	let label3;
    	let t33;
    	let input4;
    	let t34;
    	let div20;
    	let button1;
    	let t36;
    	let button2;
    	let t38;
    	let div39;
    	let div38;
    	let div37;
    	let div24;
    	let h51;
    	let t40;
    	let button3;
    	let span2;
    	let t42;
    	let div35;
    	let form1;
    	let div26;
    	let div25;
    	let label4;
    	let t44;
    	let input5;
    	let t45;
    	let div28;
    	let div27;
    	let label5;
    	let t47;
    	let input6;
    	let t48;
    	let div30;
    	let div29;
    	let label6;
    	let t50;
    	let input7;
    	let t51;
    	let div32;
    	let div31;
    	let label7;
    	let t53;
    	let input8;
    	let t54;
    	let div34;
    	let div33;
    	let label8;
    	let t56;
    	let input9;
    	let t57;
    	let div36;
    	let button4;
    	let t59;
    	let button5;
    	let t61;
    	let div45;
    	let div44;
    	let div43;
    	let div40;
    	let h52;
    	let t63;
    	let button6;
    	let span3;
    	let t65;
    	let div41;
    	let t66;
    	let strong;
    	let t67;
    	let t68_value = /*noDelete*/ ctx[4].name + "";
    	let t68;
    	let t69;
    	let t70;
    	let t71;
    	let div42;
    	let button7;
    	let t73;
    	let button8;
    	let mounted;
    	let dispose;
    	let if_block0 = show_if && create_if_block_2$3(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*visibleData*/ ctx[0].length) return create_if_block$7;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Network Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div7 = element("div");
    			div3 = element("div");
    			input0 = element("input");
    			t4 = space();
    			div4 = element("div");
    			t5 = space();
    			div5 = element("div");
    			t6 = space();
    			div6 = element("div");
    			t7 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t8 = text("Name ");
    			span0 = element("span");
    			i0 = element("i");
    			t9 = space();
    			th1 = element("th");
    			t10 = text("IP ");
    			i1 = element("i");
    			t11 = space();
    			th2 = element("th");
    			t12 = text("Subnet ");
    			i2 = element("i");
    			t13 = space();
    			th3 = element("th");
    			t14 = text("Description ");
    			i3 = element("i");
    			t15 = space();
    			th4 = element("th");
    			t16 = space();
    			th5 = element("th");
    			t17 = space();
    			if_block1.c();
    			t18 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div10 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Add Network-Object";
    			t20 = space();
    			button0 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t22 = space();
    			div19 = element("div");
    			form0 = element("form");
    			div12 = element("div");
    			div11 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t24 = space();
    			input1 = element("input");
    			t25 = space();
    			div14 = element("div");
    			div13 = element("div");
    			label1 = element("label");
    			label1.textContent = "IP";
    			t27 = space();
    			input2 = element("input");
    			t28 = space();
    			div16 = element("div");
    			div15 = element("div");
    			label2 = element("label");
    			label2.textContent = "Subnet";
    			t30 = space();
    			input3 = element("input");
    			t31 = space();
    			div18 = element("div");
    			div17 = element("div");
    			label3 = element("label");
    			label3.textContent = "Description";
    			t33 = space();
    			input4 = element("input");
    			t34 = space();
    			div20 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close";
    			t36 = space();
    			button2 = element("button");
    			button2.textContent = "Add";
    			t38 = space();
    			div39 = element("div");
    			div38 = element("div");
    			div37 = element("div");
    			div24 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Edit Network-Object";
    			t40 = space();
    			button3 = element("button");
    			span2 = element("span");
    			span2.textContent = "×";
    			t42 = space();
    			div35 = element("div");
    			form1 = element("form");
    			div26 = element("div");
    			div25 = element("div");
    			label4 = element("label");
    			label4.textContent = "Id";
    			t44 = space();
    			input5 = element("input");
    			t45 = space();
    			div28 = element("div");
    			div27 = element("div");
    			label5 = element("label");
    			label5.textContent = "Name";
    			t47 = space();
    			input6 = element("input");
    			t48 = space();
    			div30 = element("div");
    			div29 = element("div");
    			label6 = element("label");
    			label6.textContent = "IP";
    			t50 = space();
    			input7 = element("input");
    			t51 = space();
    			div32 = element("div");
    			div31 = element("div");
    			label7 = element("label");
    			label7.textContent = "Subnet";
    			t53 = space();
    			input8 = element("input");
    			t54 = space();
    			div34 = element("div");
    			div33 = element("div");
    			label8 = element("label");
    			label8.textContent = "Description";
    			t56 = space();
    			input9 = element("input");
    			t57 = space();
    			div36 = element("div");
    			button4 = element("button");
    			button4.textContent = "Close";
    			t59 = space();
    			button5 = element("button");
    			button5.textContent = "Edit";
    			t61 = space();
    			div45 = element("div");
    			div44 = element("div");
    			div43 = element("div");
    			div40 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Delete Network-Object";
    			t63 = space();
    			button6 = element("button");
    			span3 = element("span");
    			span3.textContent = "×";
    			t65 = space();
    			div41 = element("div");
    			t66 = text("Are you sure, that you want to delete this network object ");
    			strong = element("strong");
    			t67 = text("\"");
    			t68 = text(t68_value);
    			t69 = text("\"");
    			t70 = text("?");
    			t71 = space();
    			div42 = element("div");
    			button7 = element("button");
    			button7.textContent = "Close";
    			t73 = space();
    			button8 = element("button");
    			button8.textContent = "Delete";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$7, 166, 8, 3843);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$7, 165, 6, 3816);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$7, 168, 6, 3934);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$7, 164, 4, 3791);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "search");
    			attr_dev(input0, "type", "text");
    			set_style(input0, "margin-bottom", "10px");
    			attr_dev(input0, "placeholder", "search...");
    			add_location(input0, file$7, 184, 8, 4559);
    			attr_dev(div3, "class", "col");
    			add_location(div3, file$7, 183, 6, 4532);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$7, 193, 6, 4787);
    			attr_dev(div5, "class", "col");
    			add_location(div5, file$7, 194, 6, 4814);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$7, 195, 6, 4841);
    			attr_dev(div7, "class", "row g-3");
    			add_location(div7, file$7, 182, 4, 4503);
    			attr_dev(div8, "class", "container-fluid");
    			add_location(div8, file$7, 163, 2, 3756);
    			attr_dev(i0, "class", "fa fa-fw fa-sort");
    			add_location(i0, file$7, 204, 12, 5131);
    			add_location(span0, file$7, 203, 16, 5087);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$7, 202, 8, 5054);
    			attr_dev(i1, "class", "fa fa-fw fa-sort");
    			add_location(i1, file$7, 208, 14, 5258);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$7, 207, 8, 5205);
    			attr_dev(i2, "class", "fa fa-fw fa-sort");
    			add_location(i2, file$7, 211, 18, 5374);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$7, 210, 8, 5313);
    			attr_dev(i3, "class", "fa fa-fw fa-sort");
    			add_location(i3, file$7, 214, 23, 5500);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$7, 213, 8, 5429);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$7, 216, 8, 5555);
    			attr_dev(th5, "scope", "col");
    			add_location(th5, file$7, 217, 8, 5583);
    			add_location(tr, file$7, 200, 6, 4974);
    			add_location(thead, file$7, 199, 4, 4959);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allHostObjects");
    			add_location(table, file$7, 198, 2, 4886);
    			set_style(div9, "margin-left", "-52px");
    			set_style(div9, "margin-right", "-52px");
    			add_location(div9, file$7, 162, 0, 3698);
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "crateHostObject");
    			add_location(h50, file$7, 274, 8, 7424);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$7, 281, 10, 7644);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$7, 275, 8, 7502);
    			attr_dev(div10, "class", "modal-header");
    			add_location(div10, file$7, 273, 6, 7388);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$7, 288, 14, 7858);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "N_<ZONE>_<NETZWERK-NAME>");
    			add_location(input1, file$7, 289, 14, 7923);
    			attr_dev(div11, "class", "col");
    			add_location(div11, file$7, 287, 12, 7825);
    			attr_dev(div12, "class", "row mb-3");
    			add_location(div12, file$7, 286, 10, 7789);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "ip");
    			add_location(label1, file$7, 300, 14, 8265);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "ip");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$7, 301, 14, 8326);
    			attr_dev(div13, "class", "col");
    			add_location(div13, file$7, 299, 12, 8232);
    			attr_dev(div14, "class", "row mb-3");
    			add_location(div14, file$7, 298, 10, 8196);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "subnet");
    			add_location(label2, file$7, 311, 14, 8608);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "subnet");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$7, 312, 14, 8677);
    			attr_dev(div15, "class", "col");
    			add_location(div15, file$7, 310, 12, 8575);
    			attr_dev(div16, "class", "row mb-3");
    			add_location(div16, file$7, 309, 10, 8539);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "description");
    			add_location(label3, file$7, 322, 14, 8967);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "description");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$7, 323, 14, 9046);
    			attr_dev(div17, "class", "col");
    			add_location(div17, file$7, 321, 12, 8934);
    			attr_dev(div18, "class", "row mb-3");
    			add_location(div18, file$7, 320, 10, 8898);
    			attr_dev(form0, "class", "mb-5");
    			add_location(form0, file$7, 285, 8, 7758);
    			attr_dev(div19, "class", "modal-body");
    			add_location(div19, file$7, 284, 6, 7724);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-dismiss", "modal");
    			add_location(button1, file$7, 334, 8, 9340);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn");
    			attr_dev(button2, "data-dismiss", "modal");
    			set_style(button2, "background-color", "#008000");
    			set_style(button2, "color", "#fff");
    			add_location(button2, file$7, 337, 8, 9455);
    			attr_dev(div20, "class", "modal-footer");
    			add_location(div20, file$7, 333, 6, 9304);
    			attr_dev(div21, "class", "modal-content");
    			add_location(div21, file$7, 272, 4, 7353);
    			attr_dev(div22, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div22, "role", "document");
    			add_location(div22, file$7, 271, 2, 7283);
    			attr_dev(div23, "class", "modal fade");
    			attr_dev(div23, "id", "crateHO");
    			attr_dev(div23, "tabindex", "-1");
    			attr_dev(div23, "role", "dialog");
    			attr_dev(div23, "aria-labelledby", "formCreateHostObject");
    			attr_dev(div23, "aria-hidden", "true");
    			add_location(div23, file$7, 263, 0, 7136);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "editNetworkObject");
    			add_location(h51, file$7, 360, 8, 10001);
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$7, 367, 10, 10224);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "close");
    			attr_dev(button3, "data-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$7, 361, 8, 10082);
    			attr_dev(div24, "class", "modal-header");
    			add_location(div24, file$7, 359, 6, 9965);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "id");
    			add_location(label4, file$7, 374, 14, 10438);
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "id", "id");
    			attr_dev(input5, "type", "text");
    			input5.disabled = true;
    			add_location(input5, file$7, 375, 14, 10499);
    			attr_dev(div25, "class", "col");
    			add_location(div25, file$7, 373, 12, 10405);
    			attr_dev(div26, "class", "row mb-3");
    			add_location(div26, file$7, 372, 10, 10369);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "name");
    			add_location(label5, file$7, 386, 14, 10800);
    			attr_dev(input6, "class", "form-control");
    			attr_dev(input6, "id", "name");
    			attr_dev(input6, "type", "text");
    			add_location(input6, file$7, 387, 14, 10865);
    			attr_dev(div27, "class", "col");
    			add_location(div27, file$7, 385, 12, 10767);
    			attr_dev(div28, "class", "row mb-3");
    			add_location(div28, file$7, 384, 10, 10731);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "ip");
    			add_location(label6, file$7, 397, 14, 11144);
    			attr_dev(input7, "class", "form-control");
    			attr_dev(input7, "id", "ip");
    			attr_dev(input7, "type", "text");
    			add_location(input7, file$7, 398, 14, 11206);
    			attr_dev(div29, "class", "col");
    			add_location(div29, file$7, 396, 12, 11111);
    			attr_dev(div30, "class", "row mb-3");
    			add_location(div30, file$7, 395, 10, 11075);
    			attr_dev(label7, "class", "form-label");
    			attr_dev(label7, "for", "subnet");
    			add_location(label7, file$7, 408, 14, 11481);
    			attr_dev(input8, "class", "form-control");
    			attr_dev(input8, "id", "ip");
    			attr_dev(input8, "type", "text");
    			add_location(input8, file$7, 409, 14, 11551);
    			attr_dev(div31, "class", "col");
    			add_location(div31, file$7, 407, 12, 11448);
    			attr_dev(div32, "class", "row mb-3");
    			add_location(div32, file$7, 406, 10, 11412);
    			attr_dev(label8, "class", "form-label");
    			attr_dev(label8, "for", "description");
    			add_location(label8, file$7, 419, 14, 11830);
    			attr_dev(input9, "class", "form-control");
    			attr_dev(input9, "id", "description");
    			attr_dev(input9, "type", "text");
    			add_location(input9, file$7, 420, 14, 11909);
    			attr_dev(div33, "class", "col");
    			add_location(div33, file$7, 418, 12, 11797);
    			attr_dev(div34, "class", "row mb-3");
    			add_location(div34, file$7, 417, 10, 11761);
    			attr_dev(form1, "class", "mb-5");
    			add_location(form1, file$7, 371, 8, 10338);
    			attr_dev(div35, "class", "modal-body");
    			add_location(div35, file$7, 370, 6, 10304);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-secondary");
    			attr_dev(button4, "data-dismiss", "modal");
    			add_location(button4, file$7, 431, 8, 12196);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			set_style(button5, "background-color", "#008000");
    			set_style(button5, "color", "#fff");
    			attr_dev(button5, "data-dismiss", "modal");
    			add_location(button5, file$7, 434, 8, 12311);
    			attr_dev(div36, "class", "modal-footer");
    			add_location(div36, file$7, 430, 6, 12160);
    			attr_dev(div37, "class", "modal-content");
    			add_location(div37, file$7, 358, 4, 9930);
    			attr_dev(div38, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div38, "role", "document");
    			add_location(div38, file$7, 357, 2, 9860);
    			attr_dev(div39, "class", "modal fade");
    			attr_dev(div39, "id", "editNO");
    			attr_dev(div39, "tabindex", "-1");
    			attr_dev(div39, "role", "dialog");
    			attr_dev(div39, "aria-labelledby", "formEditNetworkObject");
    			attr_dev(div39, "aria-hidden", "true");
    			add_location(div39, file$7, 349, 0, 9713);
    			attr_dev(h52, "class", "modal-title");
    			attr_dev(h52, "id", "deleteNO");
    			add_location(h52, file$7, 457, 8, 12838);
    			attr_dev(span3, "aria-hidden", "true");
    			add_location(span3, file$7, 464, 10, 13054);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "close");
    			attr_dev(button6, "data-dismiss", "modal");
    			attr_dev(button6, "aria-label", "Close");
    			add_location(button6, file$7, 458, 8, 12912);
    			attr_dev(div40, "class", "modal-header");
    			add_location(div40, file$7, 456, 6, 12802);
    			add_location(strong, file$7, 468, 66, 13226);
    			attr_dev(div41, "class", "modal-body");
    			add_location(div41, file$7, 467, 6, 13134);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-secondary");
    			attr_dev(button7, "data-dismiss", "modal");
    			add_location(button7, file$7, 473, 8, 13341);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn");
    			attr_dev(button8, "data-dismiss", "modal");
    			set_style(button8, "background-color", "#c73834");
    			set_style(button8, "color", "#fff");
    			add_location(button8, file$7, 476, 8, 13456);
    			attr_dev(div42, "class", "modal-footer");
    			add_location(div42, file$7, 472, 6, 13305);
    			attr_dev(div43, "class", "modal-content");
    			add_location(div43, file$7, 455, 4, 12767);
    			attr_dev(div44, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div44, "role", "document");
    			add_location(div44, file$7, 454, 2, 12697);
    			attr_dev(div45, "class", "modal fade");
    			attr_dev(div45, "id", "deleteNO");
    			attr_dev(div45, "tabindex", "-1");
    			attr_dev(div45, "role", "dialog");
    			attr_dev(div45, "aria-labelledby", "formDeleteNO");
    			attr_dev(div45, "aria-hidden", "true");
    			add_location(div45, file$7, 446, 0, 12557);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div8, t3);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*searchText*/ ctx[1]);
    			append_dev(div7, t4);
    			append_dev(div7, div4);
    			append_dev(div7, t5);
    			append_dev(div7, div5);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div9, t7);
    			append_dev(div9, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t8);
    			append_dev(th0, span0);
    			append_dev(span0, i0);
    			append_dev(tr, t9);
    			append_dev(tr, th1);
    			append_dev(th1, t10);
    			append_dev(th1, i1);
    			append_dev(tr, t11);
    			append_dev(tr, th2);
    			append_dev(th2, t12);
    			append_dev(th2, i2);
    			append_dev(tr, t13);
    			append_dev(tr, th3);
    			append_dev(th3, t14);
    			append_dev(th3, i3);
    			append_dev(tr, t15);
    			append_dev(tr, th4);
    			append_dev(tr, t16);
    			append_dev(tr, th5);
    			append_dev(table, t17);
    			if_block1.m(table, null);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div23, anchor);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div10);
    			append_dev(div10, h50);
    			append_dev(div10, t20);
    			append_dev(div10, button0);
    			append_dev(button0, span1);
    			append_dev(div21, t22);
    			append_dev(div21, div19);
    			append_dev(div19, form0);
    			append_dev(form0, div12);
    			append_dev(div12, div11);
    			append_dev(div11, label0);
    			append_dev(div11, t24);
    			append_dev(div11, input1);
    			set_input_value(input1, /*networkObject*/ ctx[7].name);
    			append_dev(form0, t25);
    			append_dev(form0, div14);
    			append_dev(div14, div13);
    			append_dev(div13, label1);
    			append_dev(div13, t27);
    			append_dev(div13, input2);
    			set_input_value(input2, /*networkObject*/ ctx[7].ip);
    			append_dev(form0, t28);
    			append_dev(form0, div16);
    			append_dev(div16, div15);
    			append_dev(div15, label2);
    			append_dev(div15, t30);
    			append_dev(div15, input3);
    			set_input_value(input3, /*networkObject*/ ctx[7].subnet);
    			append_dev(form0, t31);
    			append_dev(form0, div18);
    			append_dev(div18, div17);
    			append_dev(div17, label3);
    			append_dev(div17, t33);
    			append_dev(div17, input4);
    			set_input_value(input4, /*networkObject*/ ctx[7].description);
    			append_dev(div21, t34);
    			append_dev(div21, div20);
    			append_dev(div20, button1);
    			append_dev(div20, t36);
    			append_dev(div20, button2);
    			insert_dev(target, t38, anchor);
    			insert_dev(target, div39, anchor);
    			append_dev(div39, div38);
    			append_dev(div38, div37);
    			append_dev(div37, div24);
    			append_dev(div24, h51);
    			append_dev(div24, t40);
    			append_dev(div24, button3);
    			append_dev(button3, span2);
    			append_dev(div37, t42);
    			append_dev(div37, div35);
    			append_dev(div35, form1);
    			append_dev(form1, div26);
    			append_dev(div26, div25);
    			append_dev(div25, label4);
    			append_dev(div25, t44);
    			append_dev(div25, input5);
    			set_input_value(input5, /*noEdit*/ ctx[3].id);
    			append_dev(form1, t45);
    			append_dev(form1, div28);
    			append_dev(div28, div27);
    			append_dev(div27, label5);
    			append_dev(div27, t47);
    			append_dev(div27, input6);
    			set_input_value(input6, /*noEdit*/ ctx[3].name);
    			append_dev(form1, t48);
    			append_dev(form1, div30);
    			append_dev(div30, div29);
    			append_dev(div29, label6);
    			append_dev(div29, t50);
    			append_dev(div29, input7);
    			set_input_value(input7, /*noEdit*/ ctx[3].ip);
    			append_dev(form1, t51);
    			append_dev(form1, div32);
    			append_dev(div32, div31);
    			append_dev(div31, label7);
    			append_dev(div31, t53);
    			append_dev(div31, input8);
    			set_input_value(input8, /*noEdit*/ ctx[3].subnet);
    			append_dev(form1, t54);
    			append_dev(form1, div34);
    			append_dev(div34, div33);
    			append_dev(div33, label8);
    			append_dev(div33, t56);
    			append_dev(div33, input9);
    			set_input_value(input9, /*noEdit*/ ctx[3].description);
    			append_dev(div37, t57);
    			append_dev(div37, div36);
    			append_dev(div36, button4);
    			append_dev(div36, t59);
    			append_dev(div36, button5);
    			insert_dev(target, t61, anchor);
    			insert_dev(target, div45, anchor);
    			append_dev(div45, div44);
    			append_dev(div44, div43);
    			append_dev(div43, div40);
    			append_dev(div40, h52);
    			append_dev(div40, t63);
    			append_dev(div40, button6);
    			append_dev(button6, span3);
    			append_dev(div43, t65);
    			append_dev(div43, div41);
    			append_dev(div41, t66);
    			append_dev(div41, strong);
    			append_dev(strong, t67);
    			append_dev(strong, t68);
    			append_dev(strong, t69);
    			append_dev(div41, t70);
    			append_dev(div43, t71);
    			append_dev(div43, div42);
    			append_dev(div42, button7);
    			append_dev(div42, t73);
    			append_dev(div42, button8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
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
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[18]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[19]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[20]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[21]),
    					listen_dev(button2, "click", /*createNetworkObject*/ ctx[8], false, false, false),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[22]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[23]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[24]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[25]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[26]),
    					listen_dev(button5, "click", /*editNo*/ ctx[10], false, false, false),
    					listen_dev(
    						button8,
    						"click",
    						function () {
    							if (is_function(/*deleteNo*/ ctx[12](/*noDelete*/ ctx[4].id))) /*deleteNo*/ ctx[12](/*noDelete*/ ctx[4].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$isAuthenticated, $user*/ 96) show_if = /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk");

    			if (show_if) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*searchText*/ 2 && input0.value !== /*searchText*/ ctx[1]) {
    				set_input_value(input0, /*searchText*/ ctx[1]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(table, null);
    				}
    			}

    			if (dirty[0] & /*networkObject*/ 128 && input1.value !== /*networkObject*/ ctx[7].name) {
    				set_input_value(input1, /*networkObject*/ ctx[7].name);
    			}

    			if (dirty[0] & /*networkObject*/ 128 && input2.value !== /*networkObject*/ ctx[7].ip) {
    				set_input_value(input2, /*networkObject*/ ctx[7].ip);
    			}

    			if (dirty[0] & /*networkObject*/ 128 && input3.value !== /*networkObject*/ ctx[7].subnet) {
    				set_input_value(input3, /*networkObject*/ ctx[7].subnet);
    			}

    			if (dirty[0] & /*networkObject*/ 128 && input4.value !== /*networkObject*/ ctx[7].description) {
    				set_input_value(input4, /*networkObject*/ ctx[7].description);
    			}

    			if (dirty[0] & /*noEdit*/ 8 && input5.value !== /*noEdit*/ ctx[3].id) {
    				set_input_value(input5, /*noEdit*/ ctx[3].id);
    			}

    			if (dirty[0] & /*noEdit*/ 8 && input6.value !== /*noEdit*/ ctx[3].name) {
    				set_input_value(input6, /*noEdit*/ ctx[3].name);
    			}

    			if (dirty[0] & /*noEdit*/ 8 && input7.value !== /*noEdit*/ ctx[3].ip) {
    				set_input_value(input7, /*noEdit*/ ctx[3].ip);
    			}

    			if (dirty[0] & /*noEdit*/ 8 && input8.value !== /*noEdit*/ ctx[3].subnet) {
    				set_input_value(input8, /*noEdit*/ ctx[3].subnet);
    			}

    			if (dirty[0] & /*noEdit*/ 8 && input9.value !== /*noEdit*/ ctx[3].description) {
    				set_input_value(input9, /*noEdit*/ ctx[3].description);
    			}

    			if (dirty[0] & /*noDelete*/ 16 && t68_value !== (t68_value = /*noDelete*/ ctx[4].name + "")) set_data_dev(t68, t68_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div23);
    			if (detaching) detach_dev(t38);
    			if (detaching) detach_dev(div39);
    			if (detaching) detach_dev(t61);
    			if (detaching) detach_dev(div45);
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

    function instance$7($$self, $$props, $$invalidate) {
    	let sort;
    	let $jwt_token;
    	let $isAuthenticated;
    	let $user;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(27, $jwt_token = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(5, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(6, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Network_Objects', slots, []);
    	const api_root = window.location.origin + "/api";
    	let networkObjects = [];

    	let networkObject = {
    		name: null,
    		ip: null,
    		subnet: null,
    		description: null
    	};

    	let visibleData;
    	let searchText;

    	let noEdit = {
    		id: null,
    		name: null,
    		ip: null,
    		subnet: null,
    		description: null
    	};

    	let noDelete = { id: null, name: null };

    	function getNetworkObjects() {
    		var config = {
    			method: "get",
    			url: api_root + "/network-object",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(13, networkObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Network Objects");
    			console.log(error);
    		});
    	}

    	getNetworkObjects();

    	function createNetworkObject() {
    		var config = {
    			method: "post",
    			url: api_root + "/network-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: networkObject
    		};

    		axios(config).then(function (response) {
    			getNetworkObjects();
    		}).catch(function (error) {
    			alert("Could not create Network Object");
    			console.log(error);
    		});

    		$$invalidate(7, networkObject = {
    			name: null,
    			ip: null,
    			subnet: null,
    			description: null
    		});
    	}

    	function getNoToEdit(no) {
    		$$invalidate(3, noEdit.id = no.id, noEdit);
    		$$invalidate(3, noEdit.name = no.name, noEdit);
    		$$invalidate(3, noEdit.ip = no.ip, noEdit);
    		$$invalidate(3, noEdit.subnet = no.subnet, noEdit);
    		$$invalidate(3, noEdit.description = no.description, noEdit);
    	}

    	function editNo() {
    		var config = {
    			method: "put",
    			url: api_root + "/network-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: noEdit
    		};

    		axios(config).then(function (response) {
    			getNetworkObjects();
    		}).catch(function (error) {
    			alert("Could not edit Network Object");
    			console.log(error);
    		});
    	}

    	function getNoToDelete(noD) {
    		$$invalidate(4, noDelete.id = noD.id, noDelete);
    		$$invalidate(4, noDelete.name = noD.name, noDelete);
    	}

    	function deleteNo(id) {
    		var config = {
    			method: "delete",
    			url: api_root + "/network-object/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			getNetworkObjects();
    		}).catch(function (error) {
    			alert("Could not delete Network Object");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Network_Objects> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		searchText = this.value;
    		$$invalidate(1, searchText);
    	}

    	const click_handler = networkObject => getNoToEdit(networkObject);
    	const click_handler_1 = networkObject => getNoToDelete(networkObject);

    	function input1_input_handler() {
    		networkObject.name = this.value;
    		$$invalidate(7, networkObject);
    	}

    	function input2_input_handler() {
    		networkObject.ip = this.value;
    		$$invalidate(7, networkObject);
    	}

    	function input3_input_handler() {
    		networkObject.subnet = this.value;
    		$$invalidate(7, networkObject);
    	}

    	function input4_input_handler() {
    		networkObject.description = this.value;
    		$$invalidate(7, networkObject);
    	}

    	function input5_input_handler() {
    		noEdit.id = this.value;
    		$$invalidate(3, noEdit);
    	}

    	function input6_input_handler() {
    		noEdit.name = this.value;
    		$$invalidate(3, noEdit);
    	}

    	function input7_input_handler() {
    		noEdit.ip = this.value;
    		$$invalidate(3, noEdit);
    	}

    	function input8_input_handler() {
    		noEdit.subnet = this.value;
    		$$invalidate(3, noEdit);
    	}

    	function input9_input_handler() {
    		noEdit.description = this.value;
    		$$invalidate(3, noEdit);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		networkObjects,
    		networkObject,
    		visibleData,
    		searchText,
    		noEdit,
    		noDelete,
    		getNetworkObjects,
    		createNetworkObject,
    		getNoToEdit,
    		editNo,
    		getNoToDelete,
    		deleteNo,
    		sortBy,
    		sort,
    		$jwt_token,
    		$isAuthenticated,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('networkObjects' in $$props) $$invalidate(13, networkObjects = $$props.networkObjects);
    		if ('networkObject' in $$props) $$invalidate(7, networkObject = $$props.networkObject);
    		if ('visibleData' in $$props) $$invalidate(0, visibleData = $$props.visibleData);
    		if ('searchText' in $$props) $$invalidate(1, searchText = $$props.searchText);
    		if ('noEdit' in $$props) $$invalidate(3, noEdit = $$props.noEdit);
    		if ('noDelete' in $$props) $$invalidate(4, noDelete = $$props.noDelete);
    		if ('sortBy' in $$props) $$invalidate(14, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(2, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*searchText, networkObjects*/ 8194) {
    			{
    				$$invalidate(0, visibleData = searchText
    				? networkObjects.filter(e => {
    						return e.name.toLowerCase().match(`${searchText.toLowerCase()}.*`) || e.ip.match(`${searchText}.*`) || e.description.toLowerCase().match(`${searchText.toLowerCase()}.*`);
    					})
    				: networkObjects);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*sortBy, visibleData*/ 16385) {
    			$$invalidate(2, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(14, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(14, sortBy.col = column, sortBy);
    					$$invalidate(14, sortBy.ascending = true, sortBy);
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
    		noEdit,
    		noDelete,
    		$isAuthenticated,
    		$user,
    		networkObject,
    		createNetworkObject,
    		getNoToEdit,
    		editNo,
    		getNoToDelete,
    		deleteNo,
    		networkObjects,
    		sortBy,
    		input0_input_handler,
    		click_handler,
    		click_handler_1,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler
    	];
    }

    class Network_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Network_Objects",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\pages\Network-Group-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$5 } = globals;
    const file$6 = "src\\pages\\Network-Group-Objects.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    // (188:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_1$6(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Network-Group-Object";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#crateHO");
    			set_style(button, "margin-top", "9px");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			add_location(button, file$6, 189, 10, 4695);
    			attr_dev(div, "class", "col");
    			set_style(div, "text-align-last", "right");
    			add_location(div, file$6, 188, 8, 4634);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(188:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (223:12) {#each n1.members as member}
    function create_each_block_3$2(ctx) {
    	let li0;
    	let t0_value = /*member*/ ctx[37].name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*member*/ ctx[37].ip + "";
    	let t2;
    	let t3_value = /*member*/ ctx[37].subnet + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$6, 223, 14, 5731);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$6, 224, 14, 5793);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    			append_dev(li1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkGroupObjects*/ 1 && t0_value !== (t0_value = /*member*/ ctx[37].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*networkGroupObjects*/ 1 && t2_value !== (t2_value = /*member*/ ctx[37].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*networkGroupObjects*/ 1 && t3_value !== (t3_value = /*member*/ ctx[37].subnet + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$2.name,
    		type: "each",
    		source: "(223:12) {#each n1.members as member}",
    		ctx
    	});

    	return block;
    }

    // (254:10) {:else}
    function create_else_block$5(ctx) {
    	let td0;
    	let t;
    	let td1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t = space();
    			td1 = element("td");
    			add_location(td0, file$6, 254, 12, 6967);
    			add_location(td1, file$6, 255, 12, 6987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(254:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (231:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block$6(ctx) {
    	let td0;
    	let button0;
    	let i0;
    	let t;
    	let td1;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[15](/*n1*/ ctx[34]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[16](/*n1*/ ctx[34]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t = space();
    			td1 = element("td");
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-pencil-square-o fa-lg");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$6, 237, 17, 6414);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#editNGO");
    			add_location(button0, file$6, 232, 15, 6203);
    			add_location(td0, file$6, 231, 12, 6183);
    			attr_dev(i1, "class", "fa fa-trash-o fa-lg");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$6, 250, 16, 6838);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#deleteNGO");
    			add_location(button1, file$6, 244, 15, 6607);
    			add_location(td1, file$6, 243, 12, 6587);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(231:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (219:6) {#each networkGroupObjects as n1}
    function create_each_block_2$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*n1*/ ctx[34].ngoName + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let td2;
    	let t3_value = /*n1*/ ctx[34].ngoDescription + "";
    	let t3;
    	let t4;
    	let show_if;
    	let t5;
    	let each_value_3 = /*n1*/ ctx[34].members;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$2(get_each_context_3$2(ctx, each_value_3, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*$isAuthenticated, $user*/ 384) show_if = null;
    		if (show_if == null) show_if = !!(/*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("helpdesk"));
    		if (show_if) return create_if_block$6;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx, [-1, -1]);
    	let if_block = current_block_type(ctx);

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
    			if_block.c();
    			t5 = space();
    			add_location(td0, file$6, 220, 10, 5636);
    			add_location(td1, file$6, 221, 10, 5669);
    			add_location(td2, file$6, 229, 10, 5964);
    			add_location(tr, file$6, 219, 8, 5620);
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
    			if_block.m(tr, null);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkGroupObjects*/ 1 && t0_value !== (t0_value = /*n1*/ ctx[34].ngoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*networkGroupObjects*/ 1) {
    				each_value_3 = /*n1*/ ctx[34].members;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$2(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*networkGroupObjects*/ 1 && t3_value !== (t3_value = /*n1*/ ctx[34].ngoDescription + "")) set_data_dev(t3, t3_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tr, t5);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(219:6) {#each networkGroupObjects as n1}",
    		ctx
    	});

    	return block;
    }

    // (331:20) {#each networkObjects as n}
    function create_each_block_1$4(ctx) {
    	let label1;
    	let div;
    	let input;
    	let input_value_value;
    	let t0;
    	let label0;
    	let t1_value = /*n*/ ctx[29].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*n*/ ctx[29].ip + "";
    	let t3;
    	let t4_value = /*n*/ ctx[29].subnet + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label1 = element("label");
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label0 = element("label");
    			t1 = text(t1_value);
    			t2 = text(" || ");
    			t3 = text(t3_value);
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(input, "class", "form-check-input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "role", "switch");
    			attr_dev(input, "id", "flexSwitchCheckDefault");
    			input.__value = input_value_value = /*n*/ ctx[29].id;
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input);
    			add_location(input, file$6, 333, 26, 9622);
    			attr_dev(label0, "class", "form-check-label");
    			attr_dev(label0, "for", "flexSwitchCheckDefault");
    			add_location(label0, file$6, 341, 26, 9979);
    			attr_dev(div, "class", "form-check form-switch");
    			add_location(div, file$6, 332, 24, 9558);
    			attr_dev(label1, "class", "list-group-item");
    			add_location(label1, file$6, 331, 22, 9501);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label1, anchor);
    			append_dev(label1, div);
    			append_dev(div, input);
    			input.checked = ~/*selection*/ ctx[4].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, label0);
    			append_dev(label0, t1);
    			append_dev(label0, t2);
    			append_dev(label0, t3);
    			append_dev(label0, t4);
    			append_dev(label1, t5);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkObjects*/ 64 && input_value_value !== (input_value_value = /*n*/ ctx[29].id)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty[0] & /*selection*/ 16) {
    				input.checked = ~/*selection*/ ctx[4].indexOf(input.__value);
    			}

    			if (dirty[0] & /*networkObjects*/ 64 && t1_value !== (t1_value = /*n*/ ctx[29].name + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*networkObjects*/ 64 && t3_value !== (t3_value = /*n*/ ctx[29].ip + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*networkObjects*/ 64 && t4_value !== (t4_value = /*n*/ ctx[29].subnet + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label1);
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(331:20) {#each networkObjects as n}",
    		ctx
    	});

    	return block;
    }

    // (453:24) {#each networkObjects as n}
    function create_each_block$5(ctx) {
    	let label1;
    	let div;
    	let input;
    	let input_value_value;
    	let t0;
    	let label0;
    	let t1_value = /*n*/ ctx[29].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*n*/ ctx[29].ip + "";
    	let t3;
    	let t4_value = /*n*/ ctx[29].subnet + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label1 = element("label");
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label0 = element("label");
    			t1 = text(t1_value);
    			t2 = text(" || ");
    			t3 = text(t3_value);
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(input, "class", "form-check-input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "role", "switch");
    			attr_dev(input, "id", "flexSwitchCheckDefault");
    			input.__value = input_value_value = /*n*/ ctx[29].id;
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input);
    			add_location(input, file$6, 455, 30, 13739);
    			attr_dev(label0, "class", "form-check-label");
    			attr_dev(label0, "for", "flexSwitchCheckDefault");
    			add_location(label0, file$6, 463, 30, 14128);
    			attr_dev(div, "class", "form-check form-switch");
    			add_location(div, file$6, 454, 28, 13671);
    			attr_dev(label1, "class", "list-group-item");
    			add_location(label1, file$6, 453, 26, 13610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label1, anchor);
    			append_dev(label1, div);
    			append_dev(div, input);
    			input.checked = ~/*selection*/ ctx[4].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, label0);
    			append_dev(label0, t1);
    			append_dev(label0, t2);
    			append_dev(label0, t3);
    			append_dev(label0, t4);
    			append_dev(label1, t5);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[24]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*networkObjects*/ 64 && input_value_value !== (input_value_value = /*n*/ ctx[29].id)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty[0] & /*selection*/ 16) {
    				input.checked = ~/*selection*/ ctx[4].indexOf(input.__value);
    			}

    			if (dirty[0] & /*networkObjects*/ 64 && t1_value !== (t1_value = /*n*/ ctx[29].name + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*networkObjects*/ 64 && t3_value !== (t3_value = /*n*/ ctx[29].ip + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*networkObjects*/ 64 && t4_value !== (t4_value = /*n*/ ctx[29].subnet + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label1);
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(453:24) {#each networkObjects as n}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let show_if = /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("helpdesk");
    	let t3;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t4;
    	let span0;
    	let i;
    	let t5;
    	let th1;
    	let t7;
    	let th2;
    	let t9;
    	let th3;
    	let t10;
    	let th4;
    	let t11;
    	let tbody;
    	let t12;
    	let div19;
    	let div18;
    	let div17;
    	let div5;
    	let h50;
    	let t14;
    	let button0;
    	let span1;
    	let t16;
    	let div15;
    	let form0;
    	let div7;
    	let div6;
    	let label0;
    	let t18;
    	let input0;
    	let t19;
    	let div9;
    	let div8;
    	let label1;
    	let t21;
    	let input1;
    	let t22;
    	let div14;
    	let div13;
    	let label2;
    	let br0;
    	let t24;
    	let button1;
    	let t26;
    	let div12;
    	let div11;
    	let div10;
    	let t27;
    	let div16;
    	let button2;
    	let t29;
    	let button3;
    	let t31;
    	let div36;
    	let div35;
    	let div34;
    	let div20;
    	let h51;
    	let t33;
    	let button4;
    	let span2;
    	let t35;
    	let div32;
    	let form1;
    	let div22;
    	let div21;
    	let label3;
    	let t37;
    	let input2;
    	let t38;
    	let div24;
    	let div23;
    	let label4;
    	let t40;
    	let input3;
    	let t41;
    	let div31;
    	let div30;
    	let label5;
    	let t43;
    	let input4;
    	let t44;
    	let div29;
    	let div28;
    	let label6;
    	let br1;
    	let t46;
    	let button5;
    	let t48;
    	let div27;
    	let div26;
    	let div25;
    	let t49;
    	let div33;
    	let button6;
    	let t51;
    	let button7;
    	let t53;
    	let div42;
    	let div41;
    	let div40;
    	let div37;
    	let h52;
    	let t55;
    	let button8;
    	let span3;
    	let t57;
    	let div38;
    	let t58;
    	let strong;
    	let t59;
    	let t60_value = /*ngoDelete*/ ctx[5].name + "";
    	let t60;
    	let t61;
    	let t62;
    	let t63;
    	let div39;
    	let button9;
    	let t65;
    	let button10;
    	let mounted;
    	let dispose;
    	let if_block = show_if && create_if_block_1$6(ctx);
    	let each_value_2 = /*networkGroupObjects*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*networkObjects*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	let each_value = /*networkObjects*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Network Group Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t4 = text("Name ");
    			span0 = element("span");
    			i = element("i");
    			t5 = space();
    			th1 = element("th");
    			th1.textContent = "Members";
    			t7 = space();
    			th2 = element("th");
    			th2.textContent = "Description";
    			t9 = space();
    			th3 = element("th");
    			t10 = space();
    			th4 = element("th");
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t12 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div17 = element("div");
    			div5 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Add Network-Group-Object";
    			t14 = space();
    			button0 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t16 = space();
    			div15 = element("div");
    			form0 = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t18 = space();
    			input0 = element("input");
    			t19 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Description";
    			t21 = space();
    			input1 = element("input");
    			t22 = space();
    			div14 = element("div");
    			div13 = element("div");
    			label2 = element("label");
    			label2.textContent = "Members";
    			br0 = element("br");
    			t24 = space();
    			button1 = element("button");
    			button1.textContent = "+ Select Members";
    			t26 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t27 = space();
    			div16 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t29 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			t31 = space();
    			div36 = element("div");
    			div35 = element("div");
    			div34 = element("div");
    			div20 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Edit Network-Group-Object";
    			t33 = space();
    			button4 = element("button");
    			span2 = element("span");
    			span2.textContent = "×";
    			t35 = space();
    			div32 = element("div");
    			form1 = element("form");
    			div22 = element("div");
    			div21 = element("div");
    			label3 = element("label");
    			label3.textContent = "Id";
    			t37 = space();
    			input2 = element("input");
    			t38 = space();
    			div24 = element("div");
    			div23 = element("div");
    			label4 = element("label");
    			label4.textContent = "Name";
    			t40 = space();
    			input3 = element("input");
    			t41 = space();
    			div31 = element("div");
    			div30 = element("div");
    			label5 = element("label");
    			label5.textContent = "Description";
    			t43 = space();
    			input4 = element("input");
    			t44 = space();
    			div29 = element("div");
    			div28 = element("div");
    			label6 = element("label");
    			label6.textContent = "Members";
    			br1 = element("br");
    			t46 = space();
    			button5 = element("button");
    			button5.textContent = "+ Edit Members";
    			t48 = space();
    			div27 = element("div");
    			div26 = element("div");
    			div25 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t49 = space();
    			div33 = element("div");
    			button6 = element("button");
    			button6.textContent = "Close";
    			t51 = space();
    			button7 = element("button");
    			button7.textContent = "Edit";
    			t53 = space();
    			div42 = element("div");
    			div41 = element("div");
    			div40 = element("div");
    			div37 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Delete Network-Group-Object";
    			t55 = space();
    			button8 = element("button");
    			span3 = element("span");
    			span3.textContent = "×";
    			t57 = space();
    			div38 = element("div");
    			t58 = text("Are you sure, that you want to delete this network group object ");
    			strong = element("strong");
    			t59 = text("\"");
    			t60 = text(t60_value);
    			t61 = text("\"");
    			t62 = text("?");
    			t63 = space();
    			div39 = element("div");
    			button9 = element("button");
    			button9.textContent = "Close";
    			t65 = space();
    			button10 = element("button");
    			button10.textContent = "Delete";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$6, 182, 8, 4313);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$6, 181, 6, 4286);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$6, 186, 6, 4432);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$6, 180, 4, 4261);
    			attr_dev(div3, "class", "container-fluid");
    			add_location(div3, file$6, 179, 2, 4226);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$6, 207, 12, 5263);
    			add_location(span0, file$6, 206, 16, 5216);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$6, 205, 8, 5183);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$6, 211, 8, 5403);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$6, 212, 8, 5441);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$6, 213, 8, 5483);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$6, 214, 8, 5511);
    			add_location(tr, file$6, 203, 6, 5103);
    			add_location(thead, file$6, 202, 4, 5088);
    			add_location(tbody, file$6, 217, 4, 5562);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allHostObjects");
    			add_location(table, file$6, 201, 2, 5015);
    			set_style(div4, "margin-left", "-52px");
    			set_style(div4, "margin-right", "-52px");
    			add_location(div4, file$6, 178, 0, 4168);
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "crateHostObject");
    			add_location(h50, file$6, 273, 8, 7364);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$6, 282, 10, 7612);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$6, 276, 8, 7470);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$6, 272, 6, 7328);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$6, 289, 14, 7826);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "NG_<ZONE>_<NETZWERK-ART>");
    			add_location(input0, file$6, 290, 14, 7891);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$6, 288, 12, 7793);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$6, 287, 10, 7757);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$6, 301, 14, 8238);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "description");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$6, 302, 14, 8317);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$6, 300, 12, 8205);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$6, 299, 10, 8169);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "membersId");
    			add_location(label2, file$6, 312, 14, 8622);
    			add_location(br0, file$6, 312, 71, 8679);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn");
    			set_style(button1, "background-color", "none");
    			set_style(button1, "color", "#000");
    			set_style(button1, "border-color", "#D3D3D3");
    			set_style(button1, "width", "466px");
    			set_style(button1, "text-align", "left");
    			attr_dev(button1, "data-toggle", "collapse");
    			attr_dev(button1, "data-target", "#collapseExample");
    			attr_dev(button1, "aria-expanded", "false");
    			attr_dev(button1, "aria-controls", "collapseExample");
    			add_location(button1, file$6, 313, 14, 8701);
    			attr_dev(div10, "class", "list-group");
    			set_style(div10, "width", "466px");
    			set_style(div10, "margin-left", "-16px");
    			set_style(div10, "margin-top", "-17px");
    			add_location(div10, file$6, 326, 18, 9281);
    			attr_dev(div11, "class", "card card-body");
    			set_style(div11, "border", "0");
    			add_location(div11, file$6, 325, 16, 9214);
    			attr_dev(div12, "class", "collapse");
    			attr_dev(div12, "id", "collapseExample");
    			add_location(div12, file$6, 324, 14, 9153);
    			attr_dev(div13, "class", "col");
    			add_location(div13, file$6, 311, 12, 8589);
    			attr_dev(div14, "class", "row mb-3");
    			add_location(div14, file$6, 310, 10, 8553);
    			attr_dev(form0, "class", "mb-5");
    			add_location(form0, file$6, 286, 8, 7726);
    			attr_dev(div15, "class", "modal-body");
    			add_location(div15, file$6, 285, 6, 7692);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$6, 357, 8, 10470);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			attr_dev(button3, "data-dismiss", "modal");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			add_location(button3, file$6, 360, 8, 10585);
    			attr_dev(div16, "class", "modal-footer");
    			add_location(div16, file$6, 356, 6, 10434);
    			attr_dev(div17, "class", "modal-content");
    			add_location(div17, file$6, 271, 4, 7293);
    			attr_dev(div18, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div18, "role", "document");
    			add_location(div18, file$6, 270, 2, 7223);
    			attr_dev(div19, "class", "modal fade");
    			attr_dev(div19, "id", "crateHO");
    			attr_dev(div19, "tabindex", "-1");
    			attr_dev(div19, "role", "dialog");
    			attr_dev(div19, "aria-labelledby", "formCreateHostObject");
    			attr_dev(div19, "aria-hidden", "true");
    			add_location(div19, file$6, 262, 0, 7076);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "editNetworkGroupObject");
    			add_location(h51, file$6, 383, 8, 11142);
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$6, 392, 10, 11398);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "close");
    			attr_dev(button4, "data-dismiss", "modal");
    			attr_dev(button4, "aria-label", "Close");
    			add_location(button4, file$6, 386, 8, 11256);
    			attr_dev(div20, "class", "modal-header");
    			add_location(div20, file$6, 382, 6, 11106);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "id");
    			add_location(label3, file$6, 399, 14, 11612);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "id");
    			attr_dev(input2, "type", "text");
    			input2.disabled = true;
    			add_location(input2, file$6, 400, 14, 11673);
    			attr_dev(div21, "class", "col");
    			add_location(div21, file$6, 398, 12, 11579);
    			attr_dev(div22, "class", "row mb-3");
    			add_location(div22, file$6, 397, 10, 11543);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "name");
    			add_location(label4, file$6, 411, 14, 11975);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "name");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$6, 412, 14, 12040);
    			attr_dev(div23, "class", "col");
    			add_location(div23, file$6, 410, 12, 11942);
    			attr_dev(div24, "class", "row mb-3");
    			add_location(div24, file$6, 409, 10, 11906);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "description");
    			add_location(label5, file$6, 423, 14, 12322);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "description");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$6, 424, 14, 12401);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "membersId");
    			add_location(label6, file$6, 433, 18, 12671);
    			add_location(br1, file$6, 433, 75, 12728);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			set_style(button5, "background-color", "none");
    			set_style(button5, "color", "#000");
    			set_style(button5, "border-color", "#D3D3D3");
    			set_style(button5, "width", "466px");
    			set_style(button5, "text-align", "left");
    			attr_dev(button5, "data-toggle", "collapse");
    			attr_dev(button5, "data-target", "#edit");
    			attr_dev(button5, "aria-expanded", "false");
    			attr_dev(button5, "aria-controls", "edit");
    			add_location(button5, file$6, 435, 18, 12773);
    			attr_dev(div25, "class", "list-group");
    			set_style(div25, "width", "466px");
    			set_style(div25, "margin-left", "-16px");
    			set_style(div25, "margin-top", "-17px");
    			add_location(div25, file$6, 448, 22, 13370);
    			attr_dev(div26, "class", "card card-body");
    			set_style(div26, "border", "0");
    			add_location(div26, file$6, 447, 20, 13299);
    			attr_dev(div27, "class", "collapse");
    			attr_dev(div27, "id", "edit");
    			add_location(div27, file$6, 446, 18, 13245);
    			attr_dev(div28, "class", "col");
    			add_location(div28, file$6, 432, 16, 12634);
    			attr_dev(div29, "class", "row mb-3");
    			add_location(div29, file$6, 431, 14, 12594);
    			attr_dev(div30, "class", "col");
    			add_location(div30, file$6, 422, 12, 12289);
    			attr_dev(div31, "class", "row mb-3");
    			add_location(div31, file$6, 421, 10, 12253);
    			attr_dev(form1, "class", "mb-5");
    			add_location(form1, file$6, 396, 8, 11512);
    			attr_dev(div32, "class", "modal-body");
    			add_location(div32, file$6, 395, 6, 11478);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-secondary");
    			attr_dev(button6, "data-dismiss", "modal");
    			add_location(button6, file$6, 481, 8, 14705);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn");
    			set_style(button7, "background-color", "#008000");
    			set_style(button7, "color", "#fff");
    			attr_dev(button7, "data-dismiss", "modal");
    			add_location(button7, file$6, 484, 8, 14820);
    			attr_dev(div33, "class", "modal-footer");
    			add_location(div33, file$6, 480, 6, 14669);
    			attr_dev(div34, "class", "modal-content");
    			add_location(div34, file$6, 381, 4, 11071);
    			attr_dev(div35, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div35, "role", "document");
    			add_location(div35, file$6, 380, 2, 11001);
    			attr_dev(div36, "class", "modal fade");
    			attr_dev(div36, "id", "editNGO");
    			attr_dev(div36, "tabindex", "-1");
    			attr_dev(div36, "role", "dialog");
    			attr_dev(div36, "aria-labelledby", "formEditNetworkGroupObject");
    			attr_dev(div36, "aria-hidden", "true");
    			add_location(div36, file$6, 372, 0, 10848);
    			attr_dev(h52, "class", "modal-title");
    			attr_dev(h52, "id", "deleteNGO");
    			add_location(h52, file$6, 507, 8, 15350);
    			attr_dev(span3, "aria-hidden", "true");
    			add_location(span3, file$6, 514, 10, 15573);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "close");
    			attr_dev(button8, "data-dismiss", "modal");
    			attr_dev(button8, "aria-label", "Close");
    			add_location(button8, file$6, 508, 8, 15431);
    			attr_dev(div37, "class", "modal-header");
    			add_location(div37, file$6, 506, 6, 15314);
    			add_location(strong, file$6, 518, 72, 15751);
    			attr_dev(div38, "class", "modal-body");
    			add_location(div38, file$6, 517, 6, 15653);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn btn-secondary");
    			attr_dev(button9, "data-dismiss", "modal");
    			add_location(button9, file$6, 523, 8, 15867);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "btn");
    			attr_dev(button10, "data-dismiss", "modal");
    			set_style(button10, "background-color", "#c73834");
    			set_style(button10, "color", "#fff");
    			add_location(button10, file$6, 526, 8, 15982);
    			attr_dev(div39, "class", "modal-footer");
    			add_location(div39, file$6, 522, 6, 15831);
    			attr_dev(div40, "class", "modal-content");
    			add_location(div40, file$6, 505, 4, 15279);
    			attr_dev(div41, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div41, "role", "document");
    			add_location(div41, file$6, 504, 2, 15209);
    			attr_dev(div42, "class", "modal fade");
    			attr_dev(div42, "id", "deleteNGO");
    			attr_dev(div42, "tabindex", "-1");
    			attr_dev(div42, "role", "dialog");
    			attr_dev(div42, "aria-labelledby", "formDeleteNGO");
    			attr_dev(div42, "aria-hidden", "true");
    			add_location(div42, file$6, 496, 0, 15067);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div4, t3);
    			append_dev(div4, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t4);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t5);
    			append_dev(tr, th1);
    			append_dev(tr, t7);
    			append_dev(tr, th2);
    			append_dev(tr, t9);
    			append_dev(tr, th3);
    			append_dev(tr, t10);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(tbody, null);
    			}

    			insert_dev(target, t12, anchor);
    			insert_dev(target, div19, anchor);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, div5);
    			append_dev(div5, h50);
    			append_dev(div5, t14);
    			append_dev(div5, button0);
    			append_dev(button0, span1);
    			append_dev(div17, t16);
    			append_dev(div17, div15);
    			append_dev(div15, form0);
    			append_dev(form0, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t18);
    			append_dev(div6, input0);
    			set_input_value(input0, /*networkGroupObject*/ ctx[2].name);
    			append_dev(form0, t19);
    			append_dev(form0, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t21);
    			append_dev(div8, input1);
    			set_input_value(input1, /*networkGroupObject*/ ctx[2].description);
    			append_dev(form0, t22);
    			append_dev(form0, div14);
    			append_dev(div14, div13);
    			append_dev(div13, label2);
    			append_dev(div13, br0);
    			append_dev(div13, t24);
    			append_dev(div13, button1);
    			append_dev(div13, t26);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div10, null);
    			}

    			append_dev(div17, t27);
    			append_dev(div17, div16);
    			append_dev(div16, button2);
    			append_dev(div16, t29);
    			append_dev(div16, button3);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, div36, anchor);
    			append_dev(div36, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div20);
    			append_dev(div20, h51);
    			append_dev(div20, t33);
    			append_dev(div20, button4);
    			append_dev(button4, span2);
    			append_dev(div34, t35);
    			append_dev(div34, div32);
    			append_dev(div32, form1);
    			append_dev(form1, div22);
    			append_dev(div22, div21);
    			append_dev(div21, label3);
    			append_dev(div21, t37);
    			append_dev(div21, input2);
    			set_input_value(input2, /*ngoEdit*/ ctx[3].id);
    			append_dev(form1, t38);
    			append_dev(form1, div24);
    			append_dev(div24, div23);
    			append_dev(div23, label4);
    			append_dev(div23, t40);
    			append_dev(div23, input3);
    			set_input_value(input3, /*ngoEdit*/ ctx[3].name);
    			append_dev(form1, t41);
    			append_dev(form1, div31);
    			append_dev(div31, div30);
    			append_dev(div30, label5);
    			append_dev(div30, t43);
    			append_dev(div30, input4);
    			set_input_value(input4, /*ngoEdit*/ ctx[3].description);
    			append_dev(div30, t44);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, label6);
    			append_dev(div28, br1);
    			append_dev(div28, t46);
    			append_dev(div28, button5);
    			append_dev(div28, t48);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div26, div25);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div25, null);
    			}

    			append_dev(div34, t49);
    			append_dev(div34, div33);
    			append_dev(div33, button6);
    			append_dev(div33, t51);
    			append_dev(div33, button7);
    			insert_dev(target, t53, anchor);
    			insert_dev(target, div42, anchor);
    			append_dev(div42, div41);
    			append_dev(div41, div40);
    			append_dev(div40, div37);
    			append_dev(div37, h52);
    			append_dev(div37, t55);
    			append_dev(div37, button8);
    			append_dev(button8, span3);
    			append_dev(div40, t57);
    			append_dev(div40, div38);
    			append_dev(div38, t58);
    			append_dev(div38, strong);
    			append_dev(strong, t59);
    			append_dev(strong, t60);
    			append_dev(strong, t61);
    			append_dev(div38, t62);
    			append_dev(div40, t63);
    			append_dev(div40, div39);
    			append_dev(div39, button9);
    			append_dev(div39, t65);
    			append_dev(div39, button10);

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
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[17]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[18]),
    					listen_dev(button3, "click", /*createNetworkGroupObject*/ ctx[9], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[22]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[23]),
    					listen_dev(button7, "click", /*editNgo*/ ctx[11], false, false, false),
    					listen_dev(
    						button10,
    						"click",
    						function () {
    							if (is_function(/*deleteNgo*/ ctx[13](/*ngoDelete*/ ctx[5].id))) /*deleteNgo*/ ctx[13](/*ngoDelete*/ ctx[5].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$isAuthenticated, $user*/ 384) show_if = /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("helpdesk");

    			if (show_if) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*getNgoToDelete, networkGroupObjects, getNgoToEdit, $isAuthenticated, $user*/ 5505) {
    				each_value_2 = /*networkGroupObjects*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*networkGroupObject*/ 4 && input0.value !== /*networkGroupObject*/ ctx[2].name) {
    				set_input_value(input0, /*networkGroupObject*/ ctx[2].name);
    			}

    			if (dirty[0] & /*networkGroupObject*/ 4 && input1.value !== /*networkGroupObject*/ ctx[2].description) {
    				set_input_value(input1, /*networkGroupObject*/ ctx[2].description);
    			}

    			if (dirty[0] & /*networkObjects, selection*/ 80) {
    				each_value_1 = /*networkObjects*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$4(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div10, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*ngoEdit*/ 8 && input2.value !== /*ngoEdit*/ ctx[3].id) {
    				set_input_value(input2, /*ngoEdit*/ ctx[3].id);
    			}

    			if (dirty[0] & /*ngoEdit*/ 8 && input3.value !== /*ngoEdit*/ ctx[3].name) {
    				set_input_value(input3, /*ngoEdit*/ ctx[3].name);
    			}

    			if (dirty[0] & /*ngoEdit*/ 8 && input4.value !== /*ngoEdit*/ ctx[3].description) {
    				set_input_value(input4, /*ngoEdit*/ ctx[3].description);
    			}

    			if (dirty[0] & /*networkObjects, selection*/ 80) {
    				each_value = /*networkObjects*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div25, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*ngoDelete*/ 32 && t60_value !== (t60_value = /*ngoDelete*/ ctx[5].name + "")) set_data_dev(t60, t60_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div19);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(div36);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t53);
    			if (detaching) detach_dev(div42);
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

    function instance$6($$self, $$props, $$invalidate) {
    	let sort;
    	let $jwt_token;
    	let $isAuthenticated;
    	let $user;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(25, $jwt_token = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(7, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(8, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Network_Group_Objects', slots, []);
    	const api_root = window.location.origin + "/api";

    	//-----------------------------
    	let networkGroupObjects = [];

    	let networkGroupObject = {
    		name: null,
    		description: null,
    		membersId: null
    	};

    	let ngoEdit = {
    		id: null,
    		name: null,
    		ip: null,
    		membersId: []
    	};

    	let selection = [];
    	let ngoDelete = { id: null, name: null };

    	function getNetworkGroupObjects() {
    		var config = {
    			method: "get",
    			url: api_root + "/service/findNo",
    			headers: { Authorization: "Bearer " + $jwt_token }
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
    		$$invalidate(2, networkGroupObject.membersId = selection, networkGroupObject);
    		$$invalidate(4, selection = []);

    		var config = {
    			method: "post",
    			url: api_root + "/network-group-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: networkGroupObject
    		};

    		axios(config).then(function (response) {
    			getNetworkGroupObjects();
    		}).catch(function (error) {
    			alert("Could not create Network Group Object");
    			console.log(error);
    		});

    		$$invalidate(2, networkGroupObject = {
    			name: null,
    			description: null,
    			membersId: null
    		});
    	}

    	//-----------------------------
    	let networkObjects = [];

    	function getNetworkObjects() {
    		var config = {
    			method: "get",
    			url: api_root + "/network-object",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(6, networkObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Network Objects");
    			console.log(error);
    		});
    	}

    	getNetworkObjects();

    	function getNgoToEdit(ngo) {
    		$$invalidate(3, ngoEdit.id = ngo.ngoId, ngoEdit);
    		$$invalidate(3, ngoEdit.name = ngo.ngoName, ngoEdit);
    		$$invalidate(3, ngoEdit.description = ngo.ngoDescription, ngoEdit);
    		$$invalidate(3, ngoEdit.membersId = ngo.membersId, ngoEdit);
    		$$invalidate(4, selection = ngoEdit.membersId);
    	}

    	function editNgo() {
    		$$invalidate(3, ngoEdit.membersId = selection, ngoEdit);
    		$$invalidate(4, selection = []);

    		var config = {
    			method: "put",
    			url: api_root + "/network-group-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: ngoEdit
    		};

    		axios(config).then(function (response) {
    			getNetworkGroupObjects();
    		}).catch(function (error) {
    			alert("Could not edit Network Group Object");
    			console.log(error);
    		});
    	}

    	function getNgoToDelete(ngoD) {
    		$$invalidate(5, ngoDelete.id = ngoD.ngoId, ngoDelete);
    		$$invalidate(5, ngoDelete.name = ngoD.ngoName, ngoDelete);
    	}

    	function deleteNgo(id) {
    		var config = {
    			method: "delete",
    			url: api_root + "/network-group-object/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			getNetworkGroupObjects();
    		}).catch(function (error) {
    			alert("Could not delete Network Group Object");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Network_Group_Objects> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];
    	const click_handler = n1 => getNgoToEdit(n1);
    	const click_handler_1 = n1 => getNgoToDelete(n1);

    	function input0_input_handler() {
    		networkGroupObject.name = this.value;
    		$$invalidate(2, networkGroupObject);
    	}

    	function input1_input_handler() {
    		networkGroupObject.description = this.value;
    		$$invalidate(2, networkGroupObject);
    	}

    	function input_change_handler() {
    		selection = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selection);
    	}

    	function input2_input_handler() {
    		ngoEdit.id = this.value;
    		$$invalidate(3, ngoEdit);
    	}

    	function input3_input_handler() {
    		ngoEdit.name = this.value;
    		$$invalidate(3, ngoEdit);
    	}

    	function input4_input_handler() {
    		ngoEdit.description = this.value;
    		$$invalidate(3, ngoEdit);
    	}

    	function input_change_handler_1() {
    		selection = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selection);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		networkGroupObjects,
    		networkGroupObject,
    		ngoEdit,
    		selection,
    		ngoDelete,
    		getNetworkGroupObjects,
    		createNetworkGroupObject,
    		networkObjects,
    		getNetworkObjects,
    		getNgoToEdit,
    		editNgo,
    		getNgoToDelete,
    		deleteNgo,
    		sortBy,
    		sort,
    		$jwt_token,
    		$isAuthenticated,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('networkGroupObjects' in $$props) $$invalidate(0, networkGroupObjects = $$props.networkGroupObjects);
    		if ('networkGroupObject' in $$props) $$invalidate(2, networkGroupObject = $$props.networkGroupObject);
    		if ('ngoEdit' in $$props) $$invalidate(3, ngoEdit = $$props.ngoEdit);
    		if ('selection' in $$props) $$invalidate(4, selection = $$props.selection);
    		if ('ngoDelete' in $$props) $$invalidate(5, ngoDelete = $$props.ngoDelete);
    		if ('networkObjects' in $$props) $$invalidate(6, networkObjects = $$props.networkObjects);
    		if ('sortBy' in $$props) $$invalidate(14, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*sortBy, networkGroupObjects*/ 16385) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(14, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(14, sortBy.col = column, sortBy);
    					$$invalidate(14, sortBy.ascending = true, sortBy);
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
    		ngoEdit,
    		selection,
    		ngoDelete,
    		networkObjects,
    		$isAuthenticated,
    		$user,
    		createNetworkGroupObject,
    		getNgoToEdit,
    		editNgo,
    		getNgoToDelete,
    		deleteNgo,
    		sortBy,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input_change_handler,
    		$$binding_groups,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input_change_handler_1
    	];
    }

    class Network_Group_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Network_Group_Objects",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\pages\Host-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$4 } = globals;
    const file$5 = "src\\pages\\Host-Objects.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (167:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_2$2(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Host-Object";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#crateHO");
    			set_style(button, "margin-top", "9px");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			add_location(button, file$5, 168, 10, 4042);
    			attr_dev(div, "class", "col");
    			set_style(div, "text-align-last", "right");
    			add_location(div, file$5, 167, 8, 3981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(167:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (252:4) {:else}
    function create_else_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No data available";
    			add_location(div, file$5, 252, 6, 6738);
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(252:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (215:4) {#if visibleData.length}
    function create_if_block$5(ctx) {
    	let tbody;
    	let each_value = /*visibleData*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tbody, file$5, 215, 6, 5392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*getHoToDelete, visibleData, getHoToEdit, $isAuthenticated, $user*/ 2660) {
    				each_value = /*visibleData*/ ctx[2];
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
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(215:4) {#if visibleData.length}",
    		ctx
    	});

    	return block;
    }

    // (245:12) {:else}
    function create_else_block$4(ctx) {
    	let td0;
    	let t;
    	let td1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t = space();
    			td1 = element("td");
    			add_location(td0, file$5, 245, 14, 6620);
    			add_location(td1, file$5, 246, 14, 6642);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(245:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (222:12) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_1$5(ctx) {
    	let td0;
    	let button0;
    	let i0;
    	let t;
    	let td1;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[16](/*hostObject*/ ctx[7]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[17](/*hostObject*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t = space();
    			td1 = element("td");
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-pencil-square-o fa-lg");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$5, 228, 19, 6027);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#editHO");
    			add_location(button0, file$5, 223, 17, 5800);
    			add_location(td0, file$5, 222, 14, 5778);
    			attr_dev(i1, "class", "fa fa-trash-o fa-lg");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$5, 241, 18, 6483);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#deleteHO");
    			add_location(button1, file$5, 235, 17, 6234);
    			add_location(td1, file$5, 234, 14, 6212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(222:12) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (217:8) {#each visibleData as hostObject}
    function create_each_block$4(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*hostObject*/ ctx[7].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*hostObject*/ ctx[7].ip + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*hostObject*/ ctx[7].description + "";
    	let t4;
    	let t5;
    	let show_if;
    	let t6;

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*$isAuthenticated, $user*/ 96) show_if = null;
    		if (show_if == null) show_if = !!(/*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk"));
    		if (show_if) return create_if_block_1$5;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

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
    			if_block.c();
    			t6 = space();
    			add_location(td0, file$5, 218, 12, 5472);
    			add_location(td1, file$5, 219, 12, 5512);
    			add_location(td2, file$5, 220, 12, 5550);
    			add_location(tr, file$5, 217, 10, 5454);
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
    			if_block.m(tr, null);
    			append_dev(tr, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*visibleData*/ 4 && t0_value !== (t0_value = /*hostObject*/ ctx[7].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*visibleData*/ 4 && t2_value !== (t2_value = /*hostObject*/ ctx[7].ip + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*visibleData*/ 4 && t4_value !== (t4_value = /*hostObject*/ ctx[7].description + "")) set_data_dev(t4, t4_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tr, t6);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(217:8) {#each visibleData as hostObject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div9;
    	let div8;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let show_if = /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk");
    	let t3;
    	let div7;
    	let div3;
    	let input0;
    	let t4;
    	let div4;
    	let t5;
    	let div5;
    	let t6;
    	let div6;
    	let t7;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t8;
    	let span0;
    	let i0;
    	let t9;
    	let th1;
    	let t10;
    	let i1;
    	let t11;
    	let th2;
    	let t12;
    	let i2;
    	let t13;
    	let th3;
    	let t14;
    	let th4;
    	let t15;
    	let t16;
    	let div21;
    	let div20;
    	let div19;
    	let div10;
    	let h50;
    	let t18;
    	let button0;
    	let span1;
    	let t20;
    	let div17;
    	let form0;
    	let div12;
    	let div11;
    	let label0;
    	let t22;
    	let input1;
    	let t23;
    	let div14;
    	let div13;
    	let label1;
    	let t25;
    	let input2;
    	let t26;
    	let div16;
    	let div15;
    	let label2;
    	let t28;
    	let input3;
    	let t29;
    	let div18;
    	let button1;
    	let t31;
    	let button2;
    	let t33;
    	let div35;
    	let div34;
    	let div33;
    	let div22;
    	let h51;
    	let t35;
    	let button3;
    	let span2;
    	let t37;
    	let div31;
    	let form1;
    	let div24;
    	let div23;
    	let label3;
    	let t39;
    	let input4;
    	let t40;
    	let div26;
    	let div25;
    	let label4;
    	let t42;
    	let input5;
    	let t43;
    	let div28;
    	let div27;
    	let label5;
    	let t45;
    	let input6;
    	let t46;
    	let div30;
    	let div29;
    	let label6;
    	let t48;
    	let input7;
    	let t49;
    	let div32;
    	let button4;
    	let t51;
    	let button5;
    	let t53;
    	let div41;
    	let div40;
    	let div39;
    	let div36;
    	let h52;
    	let t55;
    	let button6;
    	let span3;
    	let t57;
    	let div37;
    	let t58;
    	let strong;
    	let t59;
    	let t60_value = /*hoDelete*/ ctx[4].name + "";
    	let t60;
    	let t61;
    	let t62;
    	let t63;
    	let div38;
    	let button7;
    	let t65;
    	let button8;
    	let mounted;
    	let dispose;
    	let if_block0 = show_if && create_if_block_2$2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*visibleData*/ ctx[2].length) return create_if_block$5;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Host Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div7 = element("div");
    			div3 = element("div");
    			input0 = element("input");
    			t4 = space();
    			div4 = element("div");
    			t5 = space();
    			div5 = element("div");
    			t6 = space();
    			div6 = element("div");
    			t7 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t8 = text("Name ");
    			span0 = element("span");
    			i0 = element("i");
    			t9 = space();
    			th1 = element("th");
    			t10 = text("IP ");
    			i1 = element("i");
    			t11 = space();
    			th2 = element("th");
    			t12 = text("Description ");
    			i2 = element("i");
    			t13 = space();
    			th3 = element("th");
    			t14 = space();
    			th4 = element("th");
    			t15 = space();
    			if_block1.c();
    			t16 = space();
    			div21 = element("div");
    			div20 = element("div");
    			div19 = element("div");
    			div10 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Add Host-Object";
    			t18 = space();
    			button0 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t20 = space();
    			div17 = element("div");
    			form0 = element("form");
    			div12 = element("div");
    			div11 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t22 = space();
    			input1 = element("input");
    			t23 = space();
    			div14 = element("div");
    			div13 = element("div");
    			label1 = element("label");
    			label1.textContent = "IP";
    			t25 = space();
    			input2 = element("input");
    			t26 = space();
    			div16 = element("div");
    			div15 = element("div");
    			label2 = element("label");
    			label2.textContent = "Description";
    			t28 = space();
    			input3 = element("input");
    			t29 = space();
    			div18 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close";
    			t31 = space();
    			button2 = element("button");
    			button2.textContent = "Add";
    			t33 = space();
    			div35 = element("div");
    			div34 = element("div");
    			div33 = element("div");
    			div22 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Edit Host-Object";
    			t35 = space();
    			button3 = element("button");
    			span2 = element("span");
    			span2.textContent = "×";
    			t37 = space();
    			div31 = element("div");
    			form1 = element("form");
    			div24 = element("div");
    			div23 = element("div");
    			label3 = element("label");
    			label3.textContent = "Id";
    			t39 = space();
    			input4 = element("input");
    			t40 = space();
    			div26 = element("div");
    			div25 = element("div");
    			label4 = element("label");
    			label4.textContent = "Name";
    			t42 = space();
    			input5 = element("input");
    			t43 = space();
    			div28 = element("div");
    			div27 = element("div");
    			label5 = element("label");
    			label5.textContent = "IP";
    			t45 = space();
    			input6 = element("input");
    			t46 = space();
    			div30 = element("div");
    			div29 = element("div");
    			label6 = element("label");
    			label6.textContent = "Description";
    			t48 = space();
    			input7 = element("input");
    			t49 = space();
    			div32 = element("div");
    			button4 = element("button");
    			button4.textContent = "Close";
    			t51 = space();
    			button5 = element("button");
    			button5.textContent = "Edit";
    			t53 = space();
    			div41 = element("div");
    			div40 = element("div");
    			div39 = element("div");
    			div36 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Delete Host-Object";
    			t55 = space();
    			button6 = element("button");
    			span3 = element("span");
    			span3.textContent = "×";
    			t57 = space();
    			div37 = element("div");
    			t58 = text("Are you sure, that you want to delete this host object ");
    			strong = element("strong");
    			t59 = text("\"");
    			t60 = text(t60_value);
    			t61 = text("\"");
    			t62 = text("?");
    			t63 = space();
    			div38 = element("div");
    			button7 = element("button");
    			button7.textContent = "Close";
    			t65 = space();
    			button8 = element("button");
    			button8.textContent = "Delete";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$5, 163, 8, 3691);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$5, 162, 6, 3664);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$5, 165, 6, 3779);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$5, 161, 4, 3639);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "search");
    			attr_dev(input0, "type", "text");
    			set_style(input0, "margin-bottom", "10px");
    			attr_dev(input0, "placeholder", "search...");
    			add_location(input0, file$5, 181, 8, 4401);
    			attr_dev(div3, "class", "col");
    			add_location(div3, file$5, 180, 6, 4374);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$5, 190, 6, 4629);
    			attr_dev(div5, "class", "col");
    			add_location(div5, file$5, 191, 6, 4656);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$5, 192, 6, 4683);
    			attr_dev(div7, "class", "row g-3");
    			add_location(div7, file$5, 179, 4, 4345);
    			attr_dev(div8, "class", "container-fluid");
    			add_location(div8, file$5, 160, 2, 3604);
    			attr_dev(i0, "class", "fa fa-fw fa-sort");
    			add_location(i0, file$5, 201, 12, 4973);
    			add_location(span0, file$5, 200, 16, 4929);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$5, 199, 8, 4896);
    			attr_dev(i1, "class", "fa fa-fw fa-sort");
    			add_location(i1, file$5, 205, 14, 5100);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$5, 204, 8, 5047);
    			attr_dev(i2, "class", "fa fa-fw fa-sort");
    			add_location(i2, file$5, 208, 23, 5226);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$5, 207, 8, 5155);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$5, 210, 8, 5281);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$5, 211, 8, 5309);
    			add_location(tr, file$5, 197, 6, 4816);
    			add_location(thead, file$5, 196, 4, 4801);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allHostObjects");
    			add_location(table, file$5, 195, 2, 4728);
    			set_style(div9, "margin-left", "-52px");
    			set_style(div9, "margin-right", "-52px");
    			add_location(div9, file$5, 159, 0, 3546);
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "crateHostObject");
    			add_location(h50, file$5, 268, 8, 7089);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$5, 275, 10, 7306);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$5, 269, 8, 7164);
    			attr_dev(div10, "class", "modal-header");
    			add_location(div10, file$5, 267, 6, 7053);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$5, 282, 14, 7520);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "H_<ZONE>_<HOST-NAME>");
    			add_location(input1, file$5, 283, 14, 7585);
    			attr_dev(div11, "class", "col");
    			add_location(div11, file$5, 281, 12, 7487);
    			attr_dev(div12, "class", "row mb-3");
    			add_location(div12, file$5, 280, 10, 7451);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "ip");
    			add_location(label1, file$5, 294, 14, 7920);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "ip");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$5, 295, 14, 7981);
    			attr_dev(div13, "class", "col");
    			add_location(div13, file$5, 293, 12, 7887);
    			attr_dev(div14, "class", "row mb-3");
    			add_location(div14, file$5, 292, 10, 7851);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "description");
    			add_location(label2, file$5, 305, 14, 8260);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "description");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$5, 306, 14, 8339);
    			attr_dev(div15, "class", "col");
    			add_location(div15, file$5, 304, 12, 8227);
    			attr_dev(div16, "class", "row mb-3");
    			add_location(div16, file$5, 303, 10, 8191);
    			attr_dev(form0, "class", "mb-5");
    			add_location(form0, file$5, 279, 8, 7420);
    			attr_dev(div17, "class", "modal-body");
    			add_location(div17, file$5, 278, 6, 7386);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-dismiss", "modal");
    			add_location(button1, file$5, 317, 8, 8630);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn");
    			attr_dev(button2, "data-dismiss", "modal");
    			set_style(button2, "background-color", "#008000");
    			set_style(button2, "color", "#fff");
    			add_location(button2, file$5, 320, 8, 8745);
    			attr_dev(div18, "class", "modal-footer");
    			add_location(div18, file$5, 316, 6, 8594);
    			attr_dev(div19, "class", "modal-content");
    			add_location(div19, file$5, 266, 4, 7018);
    			attr_dev(div20, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div20, "role", "document");
    			add_location(div20, file$5, 265, 2, 6948);
    			attr_dev(div21, "class", "modal fade");
    			attr_dev(div21, "id", "crateHO");
    			attr_dev(div21, "tabindex", "-1");
    			attr_dev(div21, "role", "dialog");
    			attr_dev(div21, "aria-labelledby", "formCreateHostObject");
    			attr_dev(div21, "aria-hidden", "true");
    			add_location(div21, file$5, 257, 0, 6801);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "editHostObject");
    			add_location(h51, file$5, 343, 8, 9285);
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$5, 350, 10, 9502);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "close");
    			attr_dev(button3, "data-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$5, 344, 8, 9360);
    			attr_dev(div22, "class", "modal-header");
    			add_location(div22, file$5, 342, 6, 9249);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "id");
    			add_location(label3, file$5, 357, 14, 9716);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "id");
    			attr_dev(input4, "type", "text");
    			input4.disabled = true;
    			add_location(input4, file$5, 358, 14, 9777);
    			attr_dev(div23, "class", "col");
    			add_location(div23, file$5, 356, 12, 9683);
    			attr_dev(div24, "class", "row mb-3");
    			add_location(div24, file$5, 355, 10, 9647);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "name");
    			add_location(label4, file$5, 369, 14, 10078);
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "id", "name");
    			attr_dev(input5, "type", "text");
    			add_location(input5, file$5, 370, 14, 10143);
    			attr_dev(div25, "class", "col");
    			add_location(div25, file$5, 368, 12, 10045);
    			attr_dev(div26, "class", "row mb-3");
    			add_location(div26, file$5, 367, 10, 10009);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "ip");
    			add_location(label5, file$5, 380, 14, 10422);
    			attr_dev(input6, "class", "form-control");
    			attr_dev(input6, "id", "ip");
    			attr_dev(input6, "type", "text");
    			add_location(input6, file$5, 381, 14, 10484);
    			attr_dev(div27, "class", "col");
    			add_location(div27, file$5, 379, 12, 10389);
    			attr_dev(div28, "class", "row mb-3");
    			add_location(div28, file$5, 378, 10, 10353);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "description");
    			add_location(label6, file$5, 391, 14, 10759);
    			attr_dev(input7, "class", "form-control");
    			attr_dev(input7, "id", "description");
    			attr_dev(input7, "type", "text");
    			add_location(input7, file$5, 392, 14, 10838);
    			attr_dev(div29, "class", "col");
    			add_location(div29, file$5, 390, 12, 10726);
    			attr_dev(div30, "class", "row mb-3");
    			add_location(div30, file$5, 389, 10, 10690);
    			attr_dev(form1, "class", "mb-5");
    			add_location(form1, file$5, 354, 8, 9616);
    			attr_dev(div31, "class", "modal-body");
    			add_location(div31, file$5, 353, 6, 9582);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-secondary");
    			attr_dev(button4, "data-dismiss", "modal");
    			add_location(button4, file$5, 403, 8, 11125);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			set_style(button5, "background-color", "#008000");
    			set_style(button5, "color", "#fff");
    			attr_dev(button5, "data-dismiss", "modal");
    			add_location(button5, file$5, 406, 8, 11240);
    			attr_dev(div32, "class", "modal-footer");
    			add_location(div32, file$5, 402, 6, 11089);
    			attr_dev(div33, "class", "modal-content");
    			add_location(div33, file$5, 341, 4, 9214);
    			attr_dev(div34, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div34, "role", "document");
    			add_location(div34, file$5, 340, 2, 9144);
    			attr_dev(div35, "class", "modal fade");
    			attr_dev(div35, "id", "editHO");
    			attr_dev(div35, "tabindex", "-1");
    			attr_dev(div35, "role", "dialog");
    			attr_dev(div35, "aria-labelledby", "formEditHostObject");
    			attr_dev(div35, "aria-hidden", "true");
    			add_location(div35, file$5, 332, 0, 9000);
    			attr_dev(h52, "class", "modal-title");
    			attr_dev(h52, "id", "deleteHO");
    			add_location(h52, file$5, 429, 8, 11767);
    			attr_dev(span3, "aria-hidden", "true");
    			add_location(span3, file$5, 436, 10, 11980);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "close");
    			attr_dev(button6, "data-dismiss", "modal");
    			attr_dev(button6, "aria-label", "Close");
    			add_location(button6, file$5, 430, 8, 11838);
    			attr_dev(div36, "class", "modal-header");
    			add_location(div36, file$5, 428, 6, 11731);
    			add_location(strong, file$5, 440, 63, 12149);
    			attr_dev(div37, "class", "modal-body");
    			add_location(div37, file$5, 439, 6, 12060);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-secondary");
    			attr_dev(button7, "data-dismiss", "modal");
    			add_location(button7, file$5, 445, 8, 12264);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn");
    			attr_dev(button8, "data-dismiss", "modal");
    			set_style(button8, "background-color", "#c73834");
    			set_style(button8, "color", "#fff");
    			add_location(button8, file$5, 448, 8, 12379);
    			attr_dev(div38, "class", "modal-footer");
    			add_location(div38, file$5, 444, 6, 12228);
    			attr_dev(div39, "class", "modal-content");
    			add_location(div39, file$5, 427, 4, 11696);
    			attr_dev(div40, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div40, "role", "document");
    			add_location(div40, file$5, 426, 2, 11626);
    			attr_dev(div41, "class", "modal fade");
    			attr_dev(div41, "id", "deleteHO");
    			attr_dev(div41, "tabindex", "-1");
    			attr_dev(div41, "role", "dialog");
    			attr_dev(div41, "aria-labelledby", "formDeleteHO");
    			attr_dev(div41, "aria-hidden", "true");
    			add_location(div41, file$5, 418, 0, 11486);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div8, t3);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*searchText*/ ctx[0]);
    			append_dev(div7, t4);
    			append_dev(div7, div4);
    			append_dev(div7, t5);
    			append_dev(div7, div5);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div9, t7);
    			append_dev(div9, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t8);
    			append_dev(th0, span0);
    			append_dev(span0, i0);
    			append_dev(tr, t9);
    			append_dev(tr, th1);
    			append_dev(th1, t10);
    			append_dev(th1, i1);
    			append_dev(tr, t11);
    			append_dev(tr, th2);
    			append_dev(th2, t12);
    			append_dev(th2, i2);
    			append_dev(tr, t13);
    			append_dev(tr, th3);
    			append_dev(tr, t14);
    			append_dev(tr, th4);
    			append_dev(table, t15);
    			if_block1.m(table, null);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div21, anchor);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div10);
    			append_dev(div10, h50);
    			append_dev(div10, t18);
    			append_dev(div10, button0);
    			append_dev(button0, span1);
    			append_dev(div19, t20);
    			append_dev(div19, div17);
    			append_dev(div17, form0);
    			append_dev(form0, div12);
    			append_dev(div12, div11);
    			append_dev(div11, label0);
    			append_dev(div11, t22);
    			append_dev(div11, input1);
    			set_input_value(input1, /*hostObject*/ ctx[7].name);
    			append_dev(form0, t23);
    			append_dev(form0, div14);
    			append_dev(div14, div13);
    			append_dev(div13, label1);
    			append_dev(div13, t25);
    			append_dev(div13, input2);
    			set_input_value(input2, /*hostObject*/ ctx[7].ip);
    			append_dev(form0, t26);
    			append_dev(form0, div16);
    			append_dev(div16, div15);
    			append_dev(div15, label2);
    			append_dev(div15, t28);
    			append_dev(div15, input3);
    			set_input_value(input3, /*hostObject*/ ctx[7].description);
    			append_dev(div19, t29);
    			append_dev(div19, div18);
    			append_dev(div18, button1);
    			append_dev(div18, t31);
    			append_dev(div18, button2);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, div35, anchor);
    			append_dev(div35, div34);
    			append_dev(div34, div33);
    			append_dev(div33, div22);
    			append_dev(div22, h51);
    			append_dev(div22, t35);
    			append_dev(div22, button3);
    			append_dev(button3, span2);
    			append_dev(div33, t37);
    			append_dev(div33, div31);
    			append_dev(div31, form1);
    			append_dev(form1, div24);
    			append_dev(div24, div23);
    			append_dev(div23, label3);
    			append_dev(div23, t39);
    			append_dev(div23, input4);
    			set_input_value(input4, /*hoEdit*/ ctx[3].id);
    			append_dev(form1, t40);
    			append_dev(form1, div26);
    			append_dev(div26, div25);
    			append_dev(div25, label4);
    			append_dev(div25, t42);
    			append_dev(div25, input5);
    			set_input_value(input5, /*hoEdit*/ ctx[3].name);
    			append_dev(form1, t43);
    			append_dev(form1, div28);
    			append_dev(div28, div27);
    			append_dev(div27, label5);
    			append_dev(div27, t45);
    			append_dev(div27, input6);
    			set_input_value(input6, /*hoEdit*/ ctx[3].ip);
    			append_dev(form1, t46);
    			append_dev(form1, div30);
    			append_dev(div30, div29);
    			append_dev(div29, label6);
    			append_dev(div29, t48);
    			append_dev(div29, input7);
    			set_input_value(input7, /*hoEdit*/ ctx[3].description);
    			append_dev(div33, t49);
    			append_dev(div33, div32);
    			append_dev(div32, button4);
    			append_dev(div32, t51);
    			append_dev(div32, button5);
    			insert_dev(target, t53, anchor);
    			insert_dev(target, div41, anchor);
    			append_dev(div41, div40);
    			append_dev(div40, div39);
    			append_dev(div39, div36);
    			append_dev(div36, h52);
    			append_dev(div36, t55);
    			append_dev(div36, button6);
    			append_dev(button6, span3);
    			append_dev(div39, t57);
    			append_dev(div39, div37);
    			append_dev(div37, t58);
    			append_dev(div37, strong);
    			append_dev(strong, t59);
    			append_dev(strong, t60);
    			append_dev(strong, t61);
    			append_dev(div37, t62);
    			append_dev(div39, t63);
    			append_dev(div39, div38);
    			append_dev(div38, button7);
    			append_dev(div38, t65);
    			append_dev(div38, button8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
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
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[18]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[19]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[20]),
    					listen_dev(button2, "click", /*createHostObject*/ ctx[8], false, false, false),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[21]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[22]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[23]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[24]),
    					listen_dev(button5, "click", /*editHo*/ ctx[10], false, false, false),
    					listen_dev(
    						button8,
    						"click",
    						function () {
    							if (is_function(/*deleteHo*/ ctx[12](/*hoDelete*/ ctx[4].id))) /*deleteHo*/ ctx[12](/*hoDelete*/ ctx[4].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*$isAuthenticated, $user*/ 96) show_if = /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[5] && /*$user*/ ctx[6].user_roles && /*$user*/ ctx[6].user_roles.includes("helpdesk");

    			if (show_if) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*searchText*/ 1 && input0.value !== /*searchText*/ ctx[0]) {
    				set_input_value(input0, /*searchText*/ ctx[0]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(table, null);
    				}
    			}

    			if (dirty & /*hostObject*/ 128 && input1.value !== /*hostObject*/ ctx[7].name) {
    				set_input_value(input1, /*hostObject*/ ctx[7].name);
    			}

    			if (dirty & /*hostObject*/ 128 && input2.value !== /*hostObject*/ ctx[7].ip) {
    				set_input_value(input2, /*hostObject*/ ctx[7].ip);
    			}

    			if (dirty & /*hostObject*/ 128 && input3.value !== /*hostObject*/ ctx[7].description) {
    				set_input_value(input3, /*hostObject*/ ctx[7].description);
    			}

    			if (dirty & /*hoEdit*/ 8 && input4.value !== /*hoEdit*/ ctx[3].id) {
    				set_input_value(input4, /*hoEdit*/ ctx[3].id);
    			}

    			if (dirty & /*hoEdit*/ 8 && input5.value !== /*hoEdit*/ ctx[3].name) {
    				set_input_value(input5, /*hoEdit*/ ctx[3].name);
    			}

    			if (dirty & /*hoEdit*/ 8 && input6.value !== /*hoEdit*/ ctx[3].ip) {
    				set_input_value(input6, /*hoEdit*/ ctx[3].ip);
    			}

    			if (dirty & /*hoEdit*/ 8 && input7.value !== /*hoEdit*/ ctx[3].description) {
    				set_input_value(input7, /*hoEdit*/ ctx[3].description);
    			}

    			if (dirty & /*hoDelete*/ 16 && t60_value !== (t60_value = /*hoDelete*/ ctx[4].name + "")) set_data_dev(t60, t60_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div21);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(div35);
    			if (detaching) detach_dev(t53);
    			if (detaching) detach_dev(div41);
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

    function instance$5($$self, $$props, $$invalidate) {
    	let sort;
    	let $jwt_token;
    	let $isAuthenticated;
    	let $user;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(25, $jwt_token = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(5, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(6, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Host_Objects', slots, []);
    	const api_root = window.location.origin + "/api";
    	let hostObjects = [];
    	let hostObject = { name: null, ip: null, description: null };
    	let visibleData;
    	let searchText;

    	let hoEdit = {
    		id: null,
    		name: null,
    		ip: null,
    		description: null
    	};

    	let hoDelete = { id: null, name: null };

    	function getHostObjects() {
    		var config = {
    			method: "get",
    			url: api_root + "/host-object",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(13, hostObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Host Objects");
    			console.log(error);
    		});
    	}

    	getHostObjects();

    	function createHostObject() {
    		var config = {
    			method: "post",
    			url: api_root + "/host-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: hostObject
    		};

    		axios(config).then(function (response) {
    			getHostObjects();
    		}).catch(function (error) {
    			alert("Could not create Host Object");
    			console.log(error);
    		});

    		$$invalidate(7, hostObject = { name: null, ip: null, description: null });
    	}

    	function getHoToEdit(ho) {
    		$$invalidate(3, hoEdit.id = ho.id, hoEdit);
    		$$invalidate(3, hoEdit.name = ho.name, hoEdit);
    		$$invalidate(3, hoEdit.ip = ho.ip, hoEdit);
    		$$invalidate(3, hoEdit.description = ho.description, hoEdit);
    	}

    	function editHo() {
    		var config = {
    			method: "put",
    			url: api_root + "/host-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: hoEdit
    		};

    		axios(config).then(function (response) {
    			getHostObjects();
    		}).catch(function (error) {
    			alert("Could not edit Host Object");
    			console.log(error);
    		});
    	}

    	function getHoToDelete(hoD) {
    		$$invalidate(4, hoDelete.id = hoD.id, hoDelete);
    		$$invalidate(4, hoDelete.name = hoD.name, hoDelete);
    	}

    	function deleteHo(id) {
    		var config = {
    			method: "delete",
    			url: api_root + "/host-object/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			getHostObjects();
    		}).catch(function (error) {
    			alert("Could not delete Host Object");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Host_Objects> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		searchText = this.value;
    		$$invalidate(0, searchText);
    	}

    	const click_handler = hostObject => getHoToEdit(hostObject);
    	const click_handler_1 = hostObject => getHoToDelete(hostObject);

    	function input1_input_handler() {
    		hostObject.name = this.value;
    		$$invalidate(7, hostObject);
    	}

    	function input2_input_handler() {
    		hostObject.ip = this.value;
    		$$invalidate(7, hostObject);
    	}

    	function input3_input_handler() {
    		hostObject.description = this.value;
    		$$invalidate(7, hostObject);
    	}

    	function input4_input_handler() {
    		hoEdit.id = this.value;
    		$$invalidate(3, hoEdit);
    	}

    	function input5_input_handler() {
    		hoEdit.name = this.value;
    		$$invalidate(3, hoEdit);
    	}

    	function input6_input_handler() {
    		hoEdit.ip = this.value;
    		$$invalidate(3, hoEdit);
    	}

    	function input7_input_handler() {
    		hoEdit.description = this.value;
    		$$invalidate(3, hoEdit);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		hostObjects,
    		hostObject,
    		visibleData,
    		searchText,
    		hoEdit,
    		hoDelete,
    		getHostObjects,
    		createHostObject,
    		getHoToEdit,
    		editHo,
    		getHoToDelete,
    		deleteHo,
    		sortBy,
    		sort,
    		$jwt_token,
    		$isAuthenticated,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('hostObjects' in $$props) $$invalidate(13, hostObjects = $$props.hostObjects);
    		if ('hostObject' in $$props) $$invalidate(7, hostObject = $$props.hostObject);
    		if ('visibleData' in $$props) $$invalidate(2, visibleData = $$props.visibleData);
    		if ('searchText' in $$props) $$invalidate(0, searchText = $$props.searchText);
    		if ('hoEdit' in $$props) $$invalidate(3, hoEdit = $$props.hoEdit);
    		if ('hoDelete' in $$props) $$invalidate(4, hoDelete = $$props.hoDelete);
    		if ('sortBy' in $$props) $$invalidate(14, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, hostObjects*/ 24576) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(14, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(14, sortBy.col = column, sortBy);
    					$$invalidate(14, sortBy.ascending = true, sortBy);
    				}

    				// Modifier to sorting function for ascending or descending
    				let sortModifier = sortBy.ascending ? 1 : -1;

    				let sort = (a, b) => a[column] < b[column]
    				? -1 * sortModifier
    				: a[column] > b[column] ? 1 * sortModifier : 0;

    				$$invalidate(13, hostObjects = hostObjects.sort(sort));
    			});
    		}

    		if ($$self.$$.dirty & /*searchText, hostObjects*/ 8193) {
    			{
    				$$invalidate(2, visibleData = searchText
    				? hostObjects.filter(e => {
    						return e.name.toLowerCase().match(`${searchText.toLowerCase()}.*`) || e.ip.match(`${searchText}.*`) || e.description.toLowerCase().match(`${searchText.toLowerCase()}.*`);
    					})
    				: hostObjects);
    			}
    		}
    	};

    	return [
    		searchText,
    		sort,
    		visibleData,
    		hoEdit,
    		hoDelete,
    		$isAuthenticated,
    		$user,
    		hostObject,
    		createHostObject,
    		getHoToEdit,
    		editHo,
    		getHoToDelete,
    		deleteHo,
    		hostObjects,
    		sortBy,
    		input0_input_handler,
    		click_handler,
    		click_handler_1,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler
    	];
    }

    class Host_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Host_Objects",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\Host-Group-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$3 } = globals;
    const file$4 = "src\\pages\\Host-Group-Objects.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    // (188:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_1$4(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Host-Group-Object";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#crateHO");
    			set_style(button, "margin-top", "9px");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			add_location(button, file$4, 189, 10, 4626);
    			attr_dev(div, "class", "col");
    			set_style(div, "text-align-last", "right");
    			add_location(div, file$4, 188, 8, 4565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(188:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (222:12) {#each h1.members as member}
    function create_each_block_3$1(ctx) {
    	let li0;
    	let t0_value = /*member*/ ctx[37].name + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2_value = /*member*/ ctx[37].ip + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(li0, "class", "list-group-item");
    			add_location(li0, file$4, 222, 14, 5645);
    			attr_dev(li1, "class", "list-group-item");
    			set_style(li1, "font-style", "italic");
    			add_location(li1, file$4, 223, 14, 5707);
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
    			if (dirty[0] & /*hostGroupObjects*/ 1 && t0_value !== (t0_value = /*member*/ ctx[37].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*hostGroupObjects*/ 1 && t2_value !== (t2_value = /*member*/ ctx[37].ip + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(222:12) {#each h1.members as member}",
    		ctx
    	});

    	return block;
    }

    // (253:10) {:else}
    function create_else_block$3(ctx) {
    	let td0;
    	let t;
    	let td1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t = space();
    			td1 = element("td");
    			add_location(td0, file$4, 253, 12, 6866);
    			add_location(td1, file$4, 254, 12, 6886);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(253:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (230:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block$4(ctx) {
    	let td0;
    	let button0;
    	let i0;
    	let t;
    	let td1;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[15](/*h1*/ ctx[34]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[16](/*h1*/ ctx[34]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t = space();
    			td1 = element("td");
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-pencil-square-o fa-lg");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$4, 236, 17, 6313);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#editHGO");
    			add_location(button0, file$4, 231, 15, 6102);
    			add_location(td0, file$4, 230, 12, 6082);
    			attr_dev(i1, "class", "fa fa-trash-o fa-lg");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$4, 249, 16, 6737);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#deleteHGO");
    			add_location(button1, file$4, 243, 15, 6506);
    			add_location(td1, file$4, 242, 12, 6486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(230:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (219:6) {#each hostGroupObjects as h1}
    function create_each_block_2$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*h1*/ ctx[34].hgoName + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let td2;
    	let t3_value = /*h1*/ ctx[34].hgoDescription + "";
    	let t3;
    	let t4;
    	let show_if;
    	let t5;
    	let each_value_3 = /*h1*/ ctx[34].members;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*$isAuthenticated, $user*/ 384) show_if = null;
    		if (show_if == null) show_if = !!(/*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("helpdesk"));
    		if (show_if) return create_if_block$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx, [-1, -1]);
    	let if_block = current_block_type(ctx);

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
    			if_block.c();
    			t5 = space();
    			add_location(td0, file$4, 220, 10, 5561);
    			add_location(td1, file$4, 220, 32, 5583);
    			add_location(td2, file$4, 228, 10, 5863);
    			add_location(tr, file$4, 219, 8, 5545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(tr, td1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td1, null);
    			}

    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			if_block.m(tr, null);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostGroupObjects*/ 1 && t0_value !== (t0_value = /*h1*/ ctx[34].hgoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*hostGroupObjects*/ 1) {
    				each_value_3 = /*h1*/ ctx[34].members;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*hostGroupObjects*/ 1 && t3_value !== (t3_value = /*h1*/ ctx[34].hgoDescription + "")) set_data_dev(t3, t3_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tr, t5);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(219:6) {#each hostGroupObjects as h1}",
    		ctx
    	});

    	return block;
    }

    // (329:20) {#each hostObjects as h}
    function create_each_block_1$3(ctx) {
    	let label1;
    	let div;
    	let input;
    	let input_value_value;
    	let t0;
    	let label0;
    	let t1_value = /*h*/ ctx[29].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*h*/ ctx[29].ip + "";
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label1 = element("label");
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label0 = element("label");
    			t1 = text(t1_value);
    			t2 = text(" || ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(input, "class", "form-check-input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "role", "switch");
    			attr_dev(input, "id", "flexSwitchCheckDefault");
    			input.__value = input_value_value = /*h*/ ctx[29].id;
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input);
    			add_location(input, file$4, 331, 26, 9485);
    			attr_dev(label0, "class", "form-check-label");
    			attr_dev(label0, "for", "flexSwitchCheckDefault");
    			add_location(label0, file$4, 339, 26, 9842);
    			attr_dev(div, "class", "form-check form-switch");
    			add_location(div, file$4, 330, 24, 9421);
    			attr_dev(label1, "class", "list-group-item");
    			add_location(label1, file$4, 329, 22, 9364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label1, anchor);
    			append_dev(label1, div);
    			append_dev(div, input);
    			input.checked = ~/*selection*/ ctx[4].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, label0);
    			append_dev(label0, t1);
    			append_dev(label0, t2);
    			append_dev(label0, t3);
    			append_dev(label1, t4);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostObjects*/ 64 && input_value_value !== (input_value_value = /*h*/ ctx[29].id)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty[0] & /*selection*/ 16) {
    				input.checked = ~/*selection*/ ctx[4].indexOf(input.__value);
    			}

    			if (dirty[0] & /*hostObjects*/ 64 && t1_value !== (t1_value = /*h*/ ctx[29].name + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*hostObjects*/ 64 && t3_value !== (t3_value = /*h*/ ctx[29].ip + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label1);
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(329:20) {#each hostObjects as h}",
    		ctx
    	});

    	return block;
    }

    // (451:24) {#each hostObjects as h}
    function create_each_block$3(ctx) {
    	let label1;
    	let div;
    	let input;
    	let input_value_value;
    	let t0;
    	let label0;
    	let t1_value = /*h*/ ctx[29].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*h*/ ctx[29].ip + "";
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label1 = element("label");
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label0 = element("label");
    			t1 = text(t1_value);
    			t2 = text(" || ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(input, "class", "form-check-input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "role", "switch");
    			attr_dev(input, "id", "flexSwitchCheckDefault");
    			input.__value = input_value_value = /*h*/ ctx[29].id;
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input);
    			add_location(input, file$4, 453, 30, 13577);
    			attr_dev(label0, "class", "form-check-label");
    			attr_dev(label0, "for", "flexSwitchCheckDefault");
    			add_location(label0, file$4, 461, 30, 13966);
    			attr_dev(div, "class", "form-check form-switch");
    			add_location(div, file$4, 452, 28, 13509);
    			attr_dev(label1, "class", "list-group-item");
    			add_location(label1, file$4, 451, 26, 13448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label1, anchor);
    			append_dev(label1, div);
    			append_dev(div, input);
    			input.checked = ~/*selection*/ ctx[4].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, label0);
    			append_dev(label0, t1);
    			append_dev(label0, t2);
    			append_dev(label0, t3);
    			append_dev(label1, t4);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[24]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hostObjects*/ 64 && input_value_value !== (input_value_value = /*h*/ ctx[29].id)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty[0] & /*selection*/ 16) {
    				input.checked = ~/*selection*/ ctx[4].indexOf(input.__value);
    			}

    			if (dirty[0] & /*hostObjects*/ 64 && t1_value !== (t1_value = /*h*/ ctx[29].name + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*hostObjects*/ 64 && t3_value !== (t3_value = /*h*/ ctx[29].ip + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label1);
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(451:24) {#each hostObjects as h}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let show_if = /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("helpdesk");
    	let t3;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t4;
    	let span0;
    	let i;
    	let t5;
    	let th1;
    	let t7;
    	let th2;
    	let t9;
    	let th3;
    	let t10;
    	let th4;
    	let t11;
    	let tbody;
    	let t12;
    	let div19;
    	let div18;
    	let div17;
    	let div5;
    	let h50;
    	let t14;
    	let button0;
    	let span1;
    	let t16;
    	let div15;
    	let form0;
    	let div7;
    	let div6;
    	let label0;
    	let t18;
    	let input0;
    	let t19;
    	let div9;
    	let div8;
    	let label1;
    	let t21;
    	let input1;
    	let t22;
    	let div14;
    	let div13;
    	let label2;
    	let br0;
    	let t24;
    	let button1;
    	let t26;
    	let div12;
    	let div11;
    	let div10;
    	let t27;
    	let div16;
    	let button2;
    	let t29;
    	let button3;
    	let t31;
    	let div36;
    	let div35;
    	let div34;
    	let div20;
    	let h51;
    	let t33;
    	let button4;
    	let span2;
    	let t35;
    	let div32;
    	let form1;
    	let div22;
    	let div21;
    	let label3;
    	let t37;
    	let input2;
    	let t38;
    	let div24;
    	let div23;
    	let label4;
    	let t40;
    	let input3;
    	let t41;
    	let div31;
    	let div30;
    	let label5;
    	let t43;
    	let input4;
    	let t44;
    	let div29;
    	let div28;
    	let label6;
    	let br1;
    	let t46;
    	let button5;
    	let t48;
    	let div27;
    	let div26;
    	let div25;
    	let t49;
    	let div33;
    	let button6;
    	let t51;
    	let button7;
    	let t53;
    	let div42;
    	let div41;
    	let div40;
    	let div37;
    	let h52;
    	let t55;
    	let button8;
    	let span3;
    	let t57;
    	let div38;
    	let t58;
    	let strong;
    	let t59;
    	let t60_value = /*hgoDelete*/ ctx[5].name + "";
    	let t60;
    	let t61;
    	let t62;
    	let t63;
    	let div39;
    	let button9;
    	let t65;
    	let button10;
    	let mounted;
    	let dispose;
    	let if_block = show_if && create_if_block_1$4(ctx);
    	let each_value_2 = /*hostGroupObjects*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*hostObjects*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*hostObjects*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Host Group Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t4 = text("Name ");
    			span0 = element("span");
    			i = element("i");
    			t5 = space();
    			th1 = element("th");
    			th1.textContent = "Members";
    			t7 = space();
    			th2 = element("th");
    			th2.textContent = "Description";
    			t9 = space();
    			th3 = element("th");
    			t10 = space();
    			th4 = element("th");
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t12 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div17 = element("div");
    			div5 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Add Host-Group-Object";
    			t14 = space();
    			button0 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t16 = space();
    			div15 = element("div");
    			form0 = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t18 = space();
    			input0 = element("input");
    			t19 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Description";
    			t21 = space();
    			input1 = element("input");
    			t22 = space();
    			div14 = element("div");
    			div13 = element("div");
    			label2 = element("label");
    			label2.textContent = "Members";
    			br0 = element("br");
    			t24 = space();
    			button1 = element("button");
    			button1.textContent = "+ Select Members";
    			t26 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t27 = space();
    			div16 = element("div");
    			button2 = element("button");
    			button2.textContent = "Close";
    			t29 = space();
    			button3 = element("button");
    			button3.textContent = "Add";
    			t31 = space();
    			div36 = element("div");
    			div35 = element("div");
    			div34 = element("div");
    			div20 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Edit Host-Group-Object";
    			t33 = space();
    			button4 = element("button");
    			span2 = element("span");
    			span2.textContent = "×";
    			t35 = space();
    			div32 = element("div");
    			form1 = element("form");
    			div22 = element("div");
    			div21 = element("div");
    			label3 = element("label");
    			label3.textContent = "Id";
    			t37 = space();
    			input2 = element("input");
    			t38 = space();
    			div24 = element("div");
    			div23 = element("div");
    			label4 = element("label");
    			label4.textContent = "Name";
    			t40 = space();
    			input3 = element("input");
    			t41 = space();
    			div31 = element("div");
    			div30 = element("div");
    			label5 = element("label");
    			label5.textContent = "Description";
    			t43 = space();
    			input4 = element("input");
    			t44 = space();
    			div29 = element("div");
    			div28 = element("div");
    			label6 = element("label");
    			label6.textContent = "Members";
    			br1 = element("br");
    			t46 = space();
    			button5 = element("button");
    			button5.textContent = "+ Edit Members";
    			t48 = space();
    			div27 = element("div");
    			div26 = element("div");
    			div25 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t49 = space();
    			div33 = element("div");
    			button6 = element("button");
    			button6.textContent = "Close";
    			t51 = space();
    			button7 = element("button");
    			button7.textContent = "Edit";
    			t53 = space();
    			div42 = element("div");
    			div41 = element("div");
    			div40 = element("div");
    			div37 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Delete Host-Group-Object";
    			t55 = space();
    			button8 = element("button");
    			span3 = element("span");
    			span3.textContent = "×";
    			t57 = space();
    			div38 = element("div");
    			t58 = text("Are you sure, that you want to delete this host group object ");
    			strong = element("strong");
    			t59 = text("\"");
    			t60 = text(t60_value);
    			t61 = text("\"");
    			t62 = text("?");
    			t63 = space();
    			div39 = element("div");
    			button9 = element("button");
    			button9.textContent = "Close";
    			t65 = space();
    			button10 = element("button");
    			button10.textContent = "Delete";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$4, 184, 8, 4269);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$4, 183, 6, 4242);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$4, 186, 6, 4363);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$4, 182, 4, 4217);
    			attr_dev(div3, "class", "container-fluid");
    			add_location(div3, file$4, 181, 2, 4182);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$4, 207, 12, 5191);
    			add_location(span0, file$4, 206, 16, 5144);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$4, 205, 8, 5111);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$4, 211, 8, 5331);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$4, 212, 8, 5369);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$4, 213, 8, 5411);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$4, 214, 8, 5439);
    			add_location(tr, file$4, 203, 6, 5031);
    			add_location(thead, file$4, 202, 4, 5016);
    			add_location(tbody, file$4, 217, 4, 5490);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allHostObjects");
    			add_location(table, file$4, 201, 2, 4943);
    			set_style(div4, "margin-left", "-52px");
    			set_style(div4, "margin-right", "-52px");
    			add_location(div4, file$4, 180, 0, 4124);
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "crateHostObject");
    			add_location(h50, file$4, 273, 8, 7265);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$4, 280, 10, 7488);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$4, 274, 8, 7346);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$4, 272, 6, 7229);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$4, 287, 14, 7702);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "HG_<ZONE>_<HOST-ART>");
    			add_location(input0, file$4, 288, 14, 7767);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$4, 286, 12, 7669);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$4, 285, 10, 7633);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$4, 299, 14, 8107);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "description");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$4, 300, 14, 8186);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$4, 298, 12, 8074);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$4, 297, 10, 8038);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "membersId");
    			add_location(label2, file$4, 310, 14, 8488);
    			add_location(br0, file$4, 310, 71, 8545);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn");
    			set_style(button1, "background-color", "none");
    			set_style(button1, "color", "#000");
    			set_style(button1, "border-color", "#D3D3D3");
    			set_style(button1, "width", "466px");
    			set_style(button1, "text-align", "left");
    			attr_dev(button1, "data-toggle", "collapse");
    			attr_dev(button1, "data-target", "#collapseExample");
    			attr_dev(button1, "aria-expanded", "false");
    			attr_dev(button1, "aria-controls", "collapseExample");
    			add_location(button1, file$4, 311, 14, 8567);
    			attr_dev(div10, "class", "list-group");
    			set_style(div10, "width", "466px");
    			set_style(div10, "margin-left", "-16px");
    			set_style(div10, "margin-top", "-17px");
    			add_location(div10, file$4, 324, 18, 9147);
    			attr_dev(div11, "class", "card card-body");
    			set_style(div11, "border", "0");
    			add_location(div11, file$4, 323, 16, 9080);
    			attr_dev(div12, "class", "collapse");
    			attr_dev(div12, "id", "collapseExample");
    			add_location(div12, file$4, 322, 14, 9019);
    			attr_dev(div13, "class", "col");
    			add_location(div13, file$4, 309, 12, 8455);
    			attr_dev(div14, "class", "row mb-3");
    			add_location(div14, file$4, 308, 10, 8419);
    			attr_dev(form0, "class", "mb-5");
    			add_location(form0, file$4, 284, 8, 7602);
    			attr_dev(div15, "class", "modal-body");
    			add_location(div15, file$4, 283, 6, 7568);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-secondary");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$4, 355, 8, 10323);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn");
    			attr_dev(button3, "data-dismiss", "modal");
    			set_style(button3, "background-color", "#008000");
    			set_style(button3, "color", "#fff");
    			add_location(button3, file$4, 358, 8, 10438);
    			attr_dev(div16, "class", "modal-footer");
    			add_location(div16, file$4, 354, 6, 10287);
    			attr_dev(div17, "class", "modal-content");
    			add_location(div17, file$4, 271, 4, 7194);
    			attr_dev(div18, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div18, "role", "document");
    			add_location(div18, file$4, 270, 2, 7124);
    			attr_dev(div19, "class", "modal fade");
    			attr_dev(div19, "id", "crateHO");
    			attr_dev(div19, "tabindex", "-1");
    			attr_dev(div19, "role", "dialog");
    			attr_dev(div19, "aria-labelledby", "formCreateHostObject");
    			attr_dev(div19, "aria-hidden", "true");
    			add_location(div19, file$4, 262, 0, 6977);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "editHostGroupObject");
    			add_location(h51, file$4, 381, 8, 10989);
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$4, 390, 10, 11239);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "close");
    			attr_dev(button4, "data-dismiss", "modal");
    			attr_dev(button4, "aria-label", "Close");
    			add_location(button4, file$4, 384, 8, 11097);
    			attr_dev(div20, "class", "modal-header");
    			add_location(div20, file$4, 380, 6, 10953);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "id");
    			add_location(label3, file$4, 397, 14, 11453);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "id");
    			attr_dev(input2, "type", "text");
    			input2.disabled = true;
    			add_location(input2, file$4, 398, 14, 11514);
    			attr_dev(div21, "class", "col");
    			add_location(div21, file$4, 396, 12, 11420);
    			attr_dev(div22, "class", "row mb-3");
    			add_location(div22, file$4, 395, 10, 11384);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "name");
    			add_location(label4, file$4, 409, 14, 11816);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "name");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$4, 410, 14, 11881);
    			attr_dev(div23, "class", "col");
    			add_location(div23, file$4, 408, 12, 11783);
    			attr_dev(div24, "class", "row mb-3");
    			add_location(div24, file$4, 407, 10, 11747);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "description");
    			add_location(label5, file$4, 421, 14, 12163);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "description");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$4, 422, 14, 12242);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "membersId");
    			add_location(label6, file$4, 431, 18, 12512);
    			add_location(br1, file$4, 431, 75, 12569);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			set_style(button5, "background-color", "none");
    			set_style(button5, "color", "#000");
    			set_style(button5, "border-color", "#D3D3D3");
    			set_style(button5, "width", "466px");
    			set_style(button5, "text-align", "left");
    			attr_dev(button5, "data-toggle", "collapse");
    			attr_dev(button5, "data-target", "#edit");
    			attr_dev(button5, "aria-expanded", "false");
    			attr_dev(button5, "aria-controls", "edit");
    			add_location(button5, file$4, 433, 18, 12614);
    			attr_dev(div25, "class", "list-group");
    			set_style(div25, "width", "466px");
    			set_style(div25, "margin-left", "-16px");
    			set_style(div25, "margin-top", "-17px");
    			add_location(div25, file$4, 446, 22, 13211);
    			attr_dev(div26, "class", "card card-body");
    			set_style(div26, "border", "0");
    			add_location(div26, file$4, 445, 20, 13140);
    			attr_dev(div27, "class", "collapse");
    			attr_dev(div27, "id", "edit");
    			add_location(div27, file$4, 444, 18, 13086);
    			attr_dev(div28, "class", "col");
    			add_location(div28, file$4, 430, 16, 12475);
    			attr_dev(div29, "class", "row mb-3");
    			add_location(div29, file$4, 429, 14, 12435);
    			attr_dev(div30, "class", "col");
    			add_location(div30, file$4, 420, 12, 12130);
    			attr_dev(div31, "class", "row mb-3");
    			add_location(div31, file$4, 419, 10, 12094);
    			attr_dev(form1, "class", "mb-5");
    			add_location(form1, file$4, 394, 8, 11353);
    			attr_dev(div32, "class", "modal-body");
    			add_location(div32, file$4, 393, 6, 11319);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-secondary");
    			attr_dev(button6, "data-dismiss", "modal");
    			add_location(button6, file$4, 479, 8, 14533);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn");
    			set_style(button7, "background-color", "#008000");
    			set_style(button7, "color", "#fff");
    			attr_dev(button7, "data-dismiss", "modal");
    			add_location(button7, file$4, 482, 8, 14648);
    			attr_dev(div33, "class", "modal-footer");
    			add_location(div33, file$4, 478, 6, 14497);
    			attr_dev(div34, "class", "modal-content");
    			add_location(div34, file$4, 379, 4, 10918);
    			attr_dev(div35, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div35, "role", "document");
    			add_location(div35, file$4, 378, 2, 10848);
    			attr_dev(div36, "class", "modal fade");
    			attr_dev(div36, "id", "editHGO");
    			attr_dev(div36, "tabindex", "-1");
    			attr_dev(div36, "role", "dialog");
    			attr_dev(div36, "aria-labelledby", "formEditHostGroupObject");
    			attr_dev(div36, "aria-hidden", "true");
    			add_location(div36, file$4, 370, 0, 10698);
    			attr_dev(h52, "class", "modal-title");
    			attr_dev(h52, "id", "deleteHGO");
    			add_location(h52, file$4, 505, 8, 15178);
    			attr_dev(span3, "aria-hidden", "true");
    			add_location(span3, file$4, 512, 10, 15398);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "close");
    			attr_dev(button8, "data-dismiss", "modal");
    			attr_dev(button8, "aria-label", "Close");
    			add_location(button8, file$4, 506, 8, 15256);
    			attr_dev(div37, "class", "modal-header");
    			add_location(div37, file$4, 504, 6, 15142);
    			add_location(strong, file$4, 516, 69, 15573);
    			attr_dev(div38, "class", "modal-body");
    			add_location(div38, file$4, 515, 6, 15478);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn btn-secondary");
    			attr_dev(button9, "data-dismiss", "modal");
    			add_location(button9, file$4, 521, 8, 15689);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "btn");
    			attr_dev(button10, "data-dismiss", "modal");
    			set_style(button10, "background-color", "#c73834");
    			set_style(button10, "color", "#fff");
    			add_location(button10, file$4, 524, 8, 15804);
    			attr_dev(div39, "class", "modal-footer");
    			add_location(div39, file$4, 520, 6, 15653);
    			attr_dev(div40, "class", "modal-content");
    			add_location(div40, file$4, 503, 4, 15107);
    			attr_dev(div41, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div41, "role", "document");
    			add_location(div41, file$4, 502, 2, 15037);
    			attr_dev(div42, "class", "modal fade");
    			attr_dev(div42, "id", "deleteHGO");
    			attr_dev(div42, "tabindex", "-1");
    			attr_dev(div42, "role", "dialog");
    			attr_dev(div42, "aria-labelledby", "formDeleteHGO");
    			attr_dev(div42, "aria-hidden", "true");
    			add_location(div42, file$4, 494, 0, 14895);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div4, t3);
    			append_dev(div4, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t4);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t5);
    			append_dev(tr, th1);
    			append_dev(tr, t7);
    			append_dev(tr, th2);
    			append_dev(tr, t9);
    			append_dev(tr, th3);
    			append_dev(tr, t10);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(tbody, null);
    			}

    			insert_dev(target, t12, anchor);
    			insert_dev(target, div19, anchor);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, div5);
    			append_dev(div5, h50);
    			append_dev(div5, t14);
    			append_dev(div5, button0);
    			append_dev(button0, span1);
    			append_dev(div17, t16);
    			append_dev(div17, div15);
    			append_dev(div15, form0);
    			append_dev(form0, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t18);
    			append_dev(div6, input0);
    			set_input_value(input0, /*hostGroupObject*/ ctx[2].name);
    			append_dev(form0, t19);
    			append_dev(form0, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t21);
    			append_dev(div8, input1);
    			set_input_value(input1, /*hostGroupObject*/ ctx[2].description);
    			append_dev(form0, t22);
    			append_dev(form0, div14);
    			append_dev(div14, div13);
    			append_dev(div13, label2);
    			append_dev(div13, br0);
    			append_dev(div13, t24);
    			append_dev(div13, button1);
    			append_dev(div13, t26);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div10, null);
    			}

    			append_dev(div17, t27);
    			append_dev(div17, div16);
    			append_dev(div16, button2);
    			append_dev(div16, t29);
    			append_dev(div16, button3);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, div36, anchor);
    			append_dev(div36, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div20);
    			append_dev(div20, h51);
    			append_dev(div20, t33);
    			append_dev(div20, button4);
    			append_dev(button4, span2);
    			append_dev(div34, t35);
    			append_dev(div34, div32);
    			append_dev(div32, form1);
    			append_dev(form1, div22);
    			append_dev(div22, div21);
    			append_dev(div21, label3);
    			append_dev(div21, t37);
    			append_dev(div21, input2);
    			set_input_value(input2, /*hgoEdit*/ ctx[3].id);
    			append_dev(form1, t38);
    			append_dev(form1, div24);
    			append_dev(div24, div23);
    			append_dev(div23, label4);
    			append_dev(div23, t40);
    			append_dev(div23, input3);
    			set_input_value(input3, /*hgoEdit*/ ctx[3].name);
    			append_dev(form1, t41);
    			append_dev(form1, div31);
    			append_dev(div31, div30);
    			append_dev(div30, label5);
    			append_dev(div30, t43);
    			append_dev(div30, input4);
    			set_input_value(input4, /*hgoEdit*/ ctx[3].description);
    			append_dev(div30, t44);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, label6);
    			append_dev(div28, br1);
    			append_dev(div28, t46);
    			append_dev(div28, button5);
    			append_dev(div28, t48);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div26, div25);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div25, null);
    			}

    			append_dev(div34, t49);
    			append_dev(div34, div33);
    			append_dev(div33, button6);
    			append_dev(div33, t51);
    			append_dev(div33, button7);
    			insert_dev(target, t53, anchor);
    			insert_dev(target, div42, anchor);
    			append_dev(div42, div41);
    			append_dev(div41, div40);
    			append_dev(div40, div37);
    			append_dev(div37, h52);
    			append_dev(div37, t55);
    			append_dev(div37, button8);
    			append_dev(button8, span3);
    			append_dev(div40, t57);
    			append_dev(div40, div38);
    			append_dev(div38, t58);
    			append_dev(div38, strong);
    			append_dev(strong, t59);
    			append_dev(strong, t60);
    			append_dev(strong, t61);
    			append_dev(div38, t62);
    			append_dev(div40, t63);
    			append_dev(div40, div39);
    			append_dev(div39, button9);
    			append_dev(div39, t65);
    			append_dev(div39, button10);

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
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[17]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[18]),
    					listen_dev(button3, "click", /*createHostGroupObject*/ ctx[9], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[22]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[23]),
    					listen_dev(button7, "click", /*editHgo*/ ctx[11], false, false, false),
    					listen_dev(
    						button10,
    						"click",
    						function () {
    							if (is_function(/*deleteHgo*/ ctx[13](/*hgoDelete*/ ctx[5].id))) /*deleteHgo*/ ctx[13](/*hgoDelete*/ ctx[5].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$isAuthenticated, $user*/ 384) show_if = /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[7] && /*$user*/ ctx[8].user_roles && /*$user*/ ctx[8].user_roles.includes("helpdesk");

    			if (show_if) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*getHgoToDelete, hostGroupObjects, getHgoToEdit, $isAuthenticated, $user*/ 5505) {
    				each_value_2 = /*hostGroupObjects*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*hostGroupObject*/ 4 && input0.value !== /*hostGroupObject*/ ctx[2].name) {
    				set_input_value(input0, /*hostGroupObject*/ ctx[2].name);
    			}

    			if (dirty[0] & /*hostGroupObject*/ 4 && input1.value !== /*hostGroupObject*/ ctx[2].description) {
    				set_input_value(input1, /*hostGroupObject*/ ctx[2].description);
    			}

    			if (dirty[0] & /*hostObjects, selection*/ 80) {
    				each_value_1 = /*hostObjects*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div10, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*hgoEdit*/ 8 && input2.value !== /*hgoEdit*/ ctx[3].id) {
    				set_input_value(input2, /*hgoEdit*/ ctx[3].id);
    			}

    			if (dirty[0] & /*hgoEdit*/ 8 && input3.value !== /*hgoEdit*/ ctx[3].name) {
    				set_input_value(input3, /*hgoEdit*/ ctx[3].name);
    			}

    			if (dirty[0] & /*hgoEdit*/ 8 && input4.value !== /*hgoEdit*/ ctx[3].description) {
    				set_input_value(input4, /*hgoEdit*/ ctx[3].description);
    			}

    			if (dirty[0] & /*hostObjects, selection*/ 80) {
    				each_value = /*hostObjects*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div25, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*hgoDelete*/ 32 && t60_value !== (t60_value = /*hgoDelete*/ ctx[5].name + "")) set_data_dev(t60, t60_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div19);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(div36);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t53);
    			if (detaching) detach_dev(div42);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let sort;
    	let $jwt_token;
    	let $isAuthenticated;
    	let $user;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(25, $jwt_token = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(7, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(8, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Host_Group_Objects', slots, []);
    	const api_root = window.location.origin + "/api";

    	//-----------------------------
    	let hostGroupObjects = [];

    	let hostGroupObject = {
    		name: null,
    		description: null,
    		membersId: null
    	};

    	let hgoEdit = {
    		id: null,
    		name: null,
    		ip: null,
    		membersId: []
    	};

    	let selection = [];
    	let hgoDelete = { id: null, name: null };

    	function getHostGroupObjects() {
    		var config = {
    			method: "get",
    			url: api_root + "/service/findHo",
    			headers: { Authorization: "Bearer " + $jwt_token }
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
    		$$invalidate(2, hostGroupObject.membersId = selection, hostGroupObject);
    		$$invalidate(4, selection = []);

    		var config = {
    			method: "post",
    			url: api_root + "/host-group-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: hostGroupObject
    		};

    		axios(config).then(function (response) {
    			getHostGroupObjects();
    		}).catch(function (error) {
    			alert("Could not create Host Group Object");
    			console.log(error);
    		});

    		$$invalidate(2, hostGroupObject = {
    			name: null,
    			description: null,
    			membersId: null
    		});
    	}

    	//-----------------------------
    	let hostObjects = [];

    	function getHostObjects() {
    		var config = {
    			method: "get",
    			url: api_root + "/host-object",
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(6, hostObjects = response.data);
    		}).catch(function (error) {
    			alert("Could not get Host Objects");
    			console.log(error);
    		});
    	}

    	getHostObjects();

    	//-----------------------------
    	function getHgoToEdit(hgo) {
    		$$invalidate(3, hgoEdit.id = hgo.hgoId, hgoEdit);
    		$$invalidate(3, hgoEdit.name = hgo.hgoName, hgoEdit);
    		$$invalidate(3, hgoEdit.description = hgo.hgoDescription, hgoEdit);
    		$$invalidate(3, hgoEdit.membersId = hgo.membersId, hgoEdit);
    		$$invalidate(4, selection = hgoEdit.membersId);
    	}

    	function editHgo() {
    		$$invalidate(3, hgoEdit.membersId = selection, hgoEdit);
    		$$invalidate(4, selection = []);

    		var config = {
    			method: "put",
    			url: api_root + "/host-group-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: hgoEdit
    		};

    		axios(config).then(function (response) {
    			getHostGroupObjects();
    		}).catch(function (error) {
    			alert("Could not edit Host Group Object");
    			console.log(error);
    		});
    	}

    	function getHgoToDelete(hgoD) {
    		$$invalidate(5, hgoDelete.id = hgoD.hgoId, hgoDelete);
    		$$invalidate(5, hgoDelete.name = hgoD.hgoName, hgoDelete);
    	}

    	function deleteHgo(id) {
    		var config = {
    			method: "delete",
    			url: api_root + "/host-group-object/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			getHostGroupObjects();
    		}).catch(function (error) {
    			alert("Could not delete Host Group Object");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Host_Group_Objects> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];
    	const click_handler = h1 => getHgoToEdit(h1);
    	const click_handler_1 = h1 => getHgoToDelete(h1);

    	function input0_input_handler() {
    		hostGroupObject.name = this.value;
    		$$invalidate(2, hostGroupObject);
    	}

    	function input1_input_handler() {
    		hostGroupObject.description = this.value;
    		$$invalidate(2, hostGroupObject);
    	}

    	function input_change_handler() {
    		selection = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selection);
    	}

    	function input2_input_handler() {
    		hgoEdit.id = this.value;
    		$$invalidate(3, hgoEdit);
    	}

    	function input3_input_handler() {
    		hgoEdit.name = this.value;
    		$$invalidate(3, hgoEdit);
    	}

    	function input4_input_handler() {
    		hgoEdit.description = this.value;
    		$$invalidate(3, hgoEdit);
    	}

    	function input_change_handler_1() {
    		selection = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selection);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		hostGroupObjects,
    		hostGroupObject,
    		hgoEdit,
    		selection,
    		hgoDelete,
    		getHostGroupObjects,
    		createHostGroupObject,
    		hostObjects,
    		getHostObjects,
    		getHgoToEdit,
    		editHgo,
    		getHgoToDelete,
    		deleteHgo,
    		sortBy,
    		sort,
    		$jwt_token,
    		$isAuthenticated,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('hostGroupObjects' in $$props) $$invalidate(0, hostGroupObjects = $$props.hostGroupObjects);
    		if ('hostGroupObject' in $$props) $$invalidate(2, hostGroupObject = $$props.hostGroupObject);
    		if ('hgoEdit' in $$props) $$invalidate(3, hgoEdit = $$props.hgoEdit);
    		if ('selection' in $$props) $$invalidate(4, selection = $$props.selection);
    		if ('hgoDelete' in $$props) $$invalidate(5, hgoDelete = $$props.hgoDelete);
    		if ('hostObjects' in $$props) $$invalidate(6, hostObjects = $$props.hostObjects);
    		if ('sortBy' in $$props) $$invalidate(14, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*sortBy, hostGroupObjects*/ 16385) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(14, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(14, sortBy.col = column, sortBy);
    					$$invalidate(14, sortBy.ascending = true, sortBy);
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
    		hgoEdit,
    		selection,
    		hgoDelete,
    		hostObjects,
    		$isAuthenticated,
    		$user,
    		createHostGroupObject,
    		getHgoToEdit,
    		editHgo,
    		getHgoToDelete,
    		deleteHgo,
    		sortBy,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input_change_handler,
    		$$binding_groups,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input_change_handler_1
    	];
    }

    class Host_Group_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Host_Group_Objects",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\pages\Service-Group-Objects.svelte generated by Svelte v3.53.1 */

    const { console: console_1$2 } = globals;
    const file$3 = "src\\pages\\Service-Group-Objects.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    // (163:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_1$3(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Service Group Objects";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#createSGO");
    			set_style(button, "margin-top", "9px");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			add_location(button, file$3, 164, 10, 4161);
    			attr_dev(div, "class", "col");
    			set_style(div, "text-align-last", "right");
    			add_location(div, file$3, 163, 8, 4100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(163:6) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (197:12) {#each serviceGroupObject.port as port}
    function create_each_block_1$2(ctx) {
    	let li;
    	let t_value = /*port*/ ctx[28] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$3, 197, 14, 5162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*serviceGroupObjects*/ 1 && t_value !== (t_value = /*port*/ ctx[28] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(197:12) {#each serviceGroupObject.port as port}",
    		ctx
    	});

    	return block;
    }

    // (225:10) {:else}
    function create_else_block$2(ctx) {
    	let td0;
    	let t;
    	let td1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t = space();
    			td1 = element("td");
    			add_location(td0, file$3, 225, 12, 6299);
    			add_location(td1, file$3, 226, 12, 6319);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(225:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block$3(ctx) {
    	let td0;
    	let button0;
    	let i0;
    	let t;
    	let td1;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[13](/*serviceGroupObject*/ ctx[6]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[14](/*serviceGroupObject*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t = space();
    			td1 = element("td");
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-pencil-square-o fa-lg");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$3, 208, 17, 5730);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#editSGO");
    			add_location(button0, file$3, 203, 15, 5503);
    			add_location(td0, file$3, 202, 12, 5483);
    			attr_dev(i1, "class", "fa fa-trash-o fa-lg");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$3, 221, 16, 6170);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#deleteSGO");
    			add_location(button1, file$3, 215, 15, 5923);
    			add_location(td1, file$3, 214, 12, 5903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(202:10) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (193:6) {#each serviceGroupObjects as serviceGroupObject}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*serviceGroupObject*/ ctx[6].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let td2;
    	let t3_value = /*serviceGroupObject*/ ctx[6].description + "";
    	let t3;
    	let t4;
    	let show_if;
    	let t5;
    	let each_value_1 = /*serviceGroupObject*/ ctx[6].port;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*$isAuthenticated, $user*/ 48) show_if = null;
    		if (show_if == null) show_if = !!(/*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("helpdesk"));
    		if (show_if) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

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
    			if_block.c();
    			t5 = space();
    			add_location(td0, file$3, 194, 10, 5043);
    			add_location(td1, file$3, 195, 10, 5089);
    			add_location(td2, file$3, 200, 10, 5251);
    			add_location(tr, file$3, 193, 8, 5027);
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
    			if_block.m(tr, null);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*serviceGroupObjects*/ 1 && t0_value !== (t0_value = /*serviceGroupObject*/ ctx[6].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*serviceGroupObjects*/ 1) {
    				each_value_1 = /*serviceGroupObject*/ ctx[6].port;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*serviceGroupObjects*/ 1 && t3_value !== (t3_value = /*serviceGroupObject*/ ctx[6].description + "")) set_data_dev(t3, t3_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tr, t5);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(193:6) {#each serviceGroupObjects as serviceGroupObject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let show_if = /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("helpdesk");
    	let t3;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t4;
    	let span0;
    	let i;
    	let t5;
    	let th1;
    	let t7;
    	let th2;
    	let t9;
    	let th3;
    	let t10;
    	let th4;
    	let t11;
    	let tbody;
    	let t12;
    	let div16;
    	let div15;
    	let div14;
    	let div5;
    	let h50;
    	let t14;
    	let button0;
    	let span1;
    	let t16;
    	let div12;
    	let form0;
    	let div7;
    	let div6;
    	let label0;
    	let t18;
    	let input0;
    	let t19;
    	let div9;
    	let div8;
    	let label1;
    	let t21;
    	let input1;
    	let t22;
    	let div11;
    	let div10;
    	let label2;
    	let t24;
    	let input2;
    	let t25;
    	let div13;
    	let button1;
    	let t27;
    	let button2;
    	let t29;
    	let div30;
    	let div29;
    	let div28;
    	let div17;
    	let h51;
    	let t31;
    	let button3;
    	let span2;
    	let t33;
    	let div26;
    	let form1;
    	let div19;
    	let div18;
    	let label3;
    	let t35;
    	let input3;
    	let t36;
    	let div21;
    	let div20;
    	let label4;
    	let t38;
    	let input4;
    	let t39;
    	let div23;
    	let div22;
    	let label5;
    	let t41;
    	let input5;
    	let t42;
    	let div25;
    	let div24;
    	let label6;
    	let t44;
    	let input6;
    	let t45;
    	let div27;
    	let button4;
    	let t47;
    	let button5;
    	let t49;
    	let div36;
    	let div35;
    	let div34;
    	let div31;
    	let h52;
    	let t51;
    	let button6;
    	let span3;
    	let t53;
    	let div32;
    	let t54;
    	let strong;
    	let t55;
    	let t56_value = /*sgoDelete*/ ctx[3].name + "";
    	let t56;
    	let t57;
    	let t58;
    	let t59;
    	let div33;
    	let button7;
    	let t61;
    	let button8;
    	let mounted;
    	let dispose;
    	let if_block = show_if && create_if_block_1$3(ctx);
    	let each_value = /*serviceGroupObjects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Service Group Objects";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t4 = text("Name ");
    			span0 = element("span");
    			i = element("i");
    			t5 = space();
    			th1 = element("th");
    			th1.textContent = "Ports";
    			t7 = space();
    			th2 = element("th");
    			th2.textContent = "Description";
    			t9 = space();
    			th3 = element("th");
    			t10 = space();
    			th4 = element("th");
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t12 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Add Service-Group-Object";
    			t14 = space();
    			button0 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t16 = space();
    			div12 = element("div");
    			form0 = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t18 = space();
    			input0 = element("input");
    			t19 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Ports";
    			t21 = space();
    			input1 = element("input");
    			t22 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Description";
    			t24 = space();
    			input2 = element("input");
    			t25 = space();
    			div13 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close";
    			t27 = space();
    			button2 = element("button");
    			button2.textContent = "Add";
    			t29 = space();
    			div30 = element("div");
    			div29 = element("div");
    			div28 = element("div");
    			div17 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Edit service-Group-Object";
    			t31 = space();
    			button3 = element("button");
    			span2 = element("span");
    			span2.textContent = "×";
    			t33 = space();
    			div26 = element("div");
    			form1 = element("form");
    			div19 = element("div");
    			div18 = element("div");
    			label3 = element("label");
    			label3.textContent = "Id";
    			t35 = space();
    			input3 = element("input");
    			t36 = space();
    			div21 = element("div");
    			div20 = element("div");
    			label4 = element("label");
    			label4.textContent = "Name";
    			t38 = space();
    			input4 = element("input");
    			t39 = space();
    			div23 = element("div");
    			div22 = element("div");
    			label5 = element("label");
    			label5.textContent = "Ports";
    			t41 = space();
    			input5 = element("input");
    			t42 = space();
    			div25 = element("div");
    			div24 = element("div");
    			label6 = element("label");
    			label6.textContent = "Description";
    			t44 = space();
    			input6 = element("input");
    			t45 = space();
    			div27 = element("div");
    			button4 = element("button");
    			button4.textContent = "Close";
    			t47 = space();
    			button5 = element("button");
    			button5.textContent = "Edit";
    			t49 = space();
    			div36 = element("div");
    			div35 = element("div");
    			div34 = element("div");
    			div31 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Delete Service-Group-Object";
    			t51 = space();
    			button6 = element("button");
    			span3 = element("span");
    			span3.textContent = "×";
    			t53 = space();
    			div32 = element("div");
    			t54 = text("Are you sure, that you want to delete this service group object ");
    			strong = element("strong");
    			t55 = text("\"");
    			t56 = text(t56_value);
    			t57 = text("\"");
    			t58 = text("?");
    			t59 = space();
    			div33 = element("div");
    			button7 = element("button");
    			button7.textContent = "Close";
    			t61 = space();
    			button8 = element("button");
    			button8.textContent = "Delete";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$3, 157, 8, 3779);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$3, 156, 6, 3752);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$3, 161, 6, 3898);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$3, 155, 4, 3727);
    			attr_dev(div3, "class", "container-fluid");
    			add_location(div3, file$3, 154, 2, 3692);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$3, 182, 12, 4721);
    			add_location(span0, file$3, 181, 16, 4677);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$3, 180, 8, 4644);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$3, 185, 8, 4795);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$3, 186, 8, 4831);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$3, 187, 8, 4874);
    			attr_dev(th4, "scope", "col");
    			add_location(th4, file$3, 188, 8, 4902);
    			add_location(tr, file$3, 178, 6, 4564);
    			add_location(thead, file$3, 177, 4, 4549);
    			add_location(tbody, file$3, 191, 4, 4953);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allSGO");
    			add_location(table, file$3, 176, 2, 4484);
    			set_style(div4, "margin-left", "-52px");
    			set_style(div4, "margin-right", "-52px");
    			add_location(div4, file$3, 153, 0, 3634);
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "createSGO");
    			add_location(h50, file$3, 245, 8, 6693);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$3, 252, 10, 6913);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$3, 246, 8, 6771);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$3, 244, 6, 6657);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$3, 259, 14, 7127);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$3, 260, 14, 7192);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$3, 258, 12, 7094);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$3, 257, 10, 7058);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$3, 270, 14, 7483);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "tag");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$3, 271, 14, 7556);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$3, 269, 12, 7450);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$3, 268, 10, 7414);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "description");
    			add_location(label2, file$3, 281, 14, 7846);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "description");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$3, 282, 14, 7925);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$3, 280, 12, 7813);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$3, 279, 10, 7777);
    			attr_dev(form0, "class", "mb-5");
    			add_location(form0, file$3, 256, 8, 7027);
    			attr_dev(div12, "class", "modal-body");
    			add_location(div12, file$3, 255, 6, 6993);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-dismiss", "modal");
    			add_location(button1, file$3, 293, 8, 8224);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn");
    			set_style(button2, "background-color", "#008000");
    			set_style(button2, "color", "#fff");
    			attr_dev(button2, "data-dismiss", "modal");
    			add_location(button2, file$3, 296, 8, 8339);
    			attr_dev(div13, "class", "modal-footer");
    			add_location(div13, file$3, 292, 6, 8188);
    			attr_dev(div14, "class", "modal-content");
    			add_location(div14, file$3, 243, 4, 6622);
    			attr_dev(div15, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div15, "role", "document");
    			add_location(div15, file$3, 242, 2, 6552);
    			attr_dev(div16, "class", "modal fade");
    			attr_dev(div16, "id", "createSGO");
    			attr_dev(div16, "tabindex", "-1");
    			attr_dev(div16, "role", "dialog");
    			attr_dev(div16, "aria-labelledby", "formCreateSGO");
    			attr_dev(div16, "aria-hidden", "true");
    			add_location(div16, file$3, 234, 0, 6410);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "editSGO");
    			add_location(h51, file$3, 319, 8, 8881);
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$3, 326, 10, 9100);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "close");
    			attr_dev(button3, "data-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$3, 320, 8, 8958);
    			attr_dev(div17, "class", "modal-header");
    			add_location(div17, file$3, 318, 6, 8845);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "id");
    			add_location(label3, file$3, 333, 14, 9314);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "id");
    			attr_dev(input3, "type", "text");
    			input3.disabled = true;
    			add_location(input3, file$3, 334, 14, 9375);
    			attr_dev(div18, "class", "col");
    			add_location(div18, file$3, 332, 12, 9281);
    			attr_dev(div19, "class", "row mb-3");
    			add_location(div19, file$3, 331, 10, 9245);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "name");
    			add_location(label4, file$3, 345, 14, 9677);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "name");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$3, 346, 14, 9742);
    			attr_dev(div20, "class", "col");
    			add_location(div20, file$3, 344, 12, 9644);
    			attr_dev(div21, "class", "row mb-3");
    			add_location(div21, file$3, 343, 10, 9608);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "port");
    			add_location(label5, file$3, 356, 14, 10022);
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "id", "tags");
    			attr_dev(input5, "type", "text");
    			add_location(input5, file$3, 357, 14, 10089);
    			attr_dev(div22, "class", "col");
    			add_location(div22, file$3, 355, 12, 9989);
    			attr_dev(div23, "class", "row mb-3");
    			add_location(div23, file$3, 354, 10, 9953);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "description");
    			add_location(label6, file$3, 367, 14, 10369);
    			attr_dev(input6, "class", "form-control");
    			attr_dev(input6, "id", "description");
    			attr_dev(input6, "type", "text");
    			add_location(input6, file$3, 368, 14, 10448);
    			attr_dev(div24, "class", "col");
    			add_location(div24, file$3, 366, 12, 10336);
    			attr_dev(div25, "class", "row mb-3");
    			add_location(div25, file$3, 365, 10, 10300);
    			attr_dev(form1, "class", "mb-5");
    			add_location(form1, file$3, 330, 8, 9214);
    			attr_dev(div26, "class", "modal-body");
    			add_location(div26, file$3, 329, 6, 9180);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-secondary");
    			attr_dev(button4, "data-dismiss", "modal");
    			add_location(button4, file$3, 379, 8, 10736);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			attr_dev(button5, "data-dismiss", "modal");
    			set_style(button5, "background-color", "#008000");
    			set_style(button5, "color", "#fff");
    			add_location(button5, file$3, 382, 8, 10851);
    			attr_dev(div27, "class", "modal-footer");
    			add_location(div27, file$3, 378, 6, 10700);
    			attr_dev(div28, "class", "modal-content");
    			add_location(div28, file$3, 317, 4, 8810);
    			attr_dev(div29, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div29, "role", "document");
    			add_location(div29, file$3, 316, 2, 8740);
    			attr_dev(div30, "class", "modal fade");
    			attr_dev(div30, "id", "editSGO");
    			attr_dev(div30, "tabindex", "-1");
    			attr_dev(div30, "role", "dialog");
    			attr_dev(div30, "aria-labelledby", "formEditSGO");
    			attr_dev(div30, "aria-hidden", "true");
    			add_location(div30, file$3, 308, 0, 8602);
    			attr_dev(h52, "class", "modal-title");
    			attr_dev(h52, "id", "deleteSGO");
    			add_location(h52, file$3, 405, 8, 11381);
    			attr_dev(span3, "aria-hidden", "true");
    			add_location(span3, file$3, 412, 10, 11604);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "close");
    			attr_dev(button6, "data-dismiss", "modal");
    			attr_dev(button6, "aria-label", "Close");
    			add_location(button6, file$3, 406, 8, 11462);
    			attr_dev(div31, "class", "modal-header");
    			add_location(div31, file$3, 404, 6, 11345);
    			add_location(strong, file$3, 416, 72, 11782);
    			attr_dev(div32, "class", "modal-body");
    			add_location(div32, file$3, 415, 6, 11684);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-secondary");
    			attr_dev(button7, "data-dismiss", "modal");
    			add_location(button7, file$3, 421, 8, 11898);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn");
    			attr_dev(button8, "data-dismiss", "modal");
    			set_style(button8, "background-color", "#c73834");
    			set_style(button8, "color", "#fff");
    			add_location(button8, file$3, 424, 8, 12013);
    			attr_dev(div33, "class", "modal-footer");
    			add_location(div33, file$3, 420, 6, 11862);
    			attr_dev(div34, "class", "modal-content");
    			add_location(div34, file$3, 403, 4, 11310);
    			attr_dev(div35, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div35, "role", "document");
    			add_location(div35, file$3, 402, 2, 11240);
    			attr_dev(div36, "class", "modal fade");
    			attr_dev(div36, "id", "deleteSGO");
    			attr_dev(div36, "tabindex", "-1");
    			attr_dev(div36, "role", "dialog");
    			attr_dev(div36, "aria-labelledby", "formDeleteSGO");
    			attr_dev(div36, "aria-hidden", "true");
    			add_location(div36, file$3, 394, 0, 11098);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div4, t3);
    			append_dev(div4, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t4);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t5);
    			append_dev(tr, th1);
    			append_dev(tr, t7);
    			append_dev(tr, th2);
    			append_dev(tr, t9);
    			append_dev(tr, th3);
    			append_dev(tr, t10);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t12, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			append_dev(div5, h50);
    			append_dev(div5, t14);
    			append_dev(div5, button0);
    			append_dev(button0, span1);
    			append_dev(div14, t16);
    			append_dev(div14, div12);
    			append_dev(div12, form0);
    			append_dev(form0, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t18);
    			append_dev(div6, input0);
    			set_input_value(input0, /*serviceGroupObject*/ ctx[6].name);
    			append_dev(form0, t19);
    			append_dev(form0, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t21);
    			append_dev(div8, input1);
    			set_input_value(input1, /*serviceGroupObject*/ ctx[6].port);
    			append_dev(form0, t22);
    			append_dev(form0, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t24);
    			append_dev(div10, input2);
    			set_input_value(input2, /*serviceGroupObject*/ ctx[6].description);
    			append_dev(div14, t25);
    			append_dev(div14, div13);
    			append_dev(div13, button1);
    			append_dev(div13, t27);
    			append_dev(div13, button2);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, div30, anchor);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div17);
    			append_dev(div17, h51);
    			append_dev(div17, t31);
    			append_dev(div17, button3);
    			append_dev(button3, span2);
    			append_dev(div28, t33);
    			append_dev(div28, div26);
    			append_dev(div26, form1);
    			append_dev(form1, div19);
    			append_dev(div19, div18);
    			append_dev(div18, label3);
    			append_dev(div18, t35);
    			append_dev(div18, input3);
    			set_input_value(input3, /*sgoEdit*/ ctx[2].id);
    			append_dev(form1, t36);
    			append_dev(form1, div21);
    			append_dev(div21, div20);
    			append_dev(div20, label4);
    			append_dev(div20, t38);
    			append_dev(div20, input4);
    			set_input_value(input4, /*sgoEdit*/ ctx[2].name);
    			append_dev(form1, t39);
    			append_dev(form1, div23);
    			append_dev(div23, div22);
    			append_dev(div22, label5);
    			append_dev(div22, t41);
    			append_dev(div22, input5);
    			set_input_value(input5, /*sgoEdit*/ ctx[2].port);
    			append_dev(form1, t42);
    			append_dev(form1, div25);
    			append_dev(div25, div24);
    			append_dev(div24, label6);
    			append_dev(div24, t44);
    			append_dev(div24, input6);
    			set_input_value(input6, /*sgoEdit*/ ctx[2].description);
    			append_dev(div28, t45);
    			append_dev(div28, div27);
    			append_dev(div27, button4);
    			append_dev(div27, t47);
    			append_dev(div27, button5);
    			insert_dev(target, t49, anchor);
    			insert_dev(target, div36, anchor);
    			append_dev(div36, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div31);
    			append_dev(div31, h52);
    			append_dev(div31, t51);
    			append_dev(div31, button6);
    			append_dev(button6, span3);
    			append_dev(div34, t53);
    			append_dev(div34, div32);
    			append_dev(div32, t54);
    			append_dev(div32, strong);
    			append_dev(strong, t55);
    			append_dev(strong, t56);
    			append_dev(strong, t57);
    			append_dev(div32, t58);
    			append_dev(div34, t59);
    			append_dev(div34, div33);
    			append_dev(div33, button7);
    			append_dev(div33, t61);
    			append_dev(div33, button8);

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
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[17]),
    					listen_dev(button2, "click", /*createServiceGroupObject*/ ctx[7], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[18]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[19]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[20]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[21]),
    					listen_dev(button5, "click", /*editSGO*/ ctx[9], false, false, false),
    					listen_dev(
    						button8,
    						"click",
    						function () {
    							if (is_function(/*deleteSgo*/ ctx[11](/*sgoDelete*/ ctx[3].id))) /*deleteSgo*/ ctx[11](/*sgoDelete*/ ctx[3].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*$isAuthenticated, $user*/ 48) show_if = /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("helpdesk");

    			if (show_if) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*getSgoToDelete, serviceGroupObjects, getSgoToEdit, $isAuthenticated, $user*/ 1329) {
    				each_value = /*serviceGroupObjects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*serviceGroupObject*/ 64 && input0.value !== /*serviceGroupObject*/ ctx[6].name) {
    				set_input_value(input0, /*serviceGroupObject*/ ctx[6].name);
    			}

    			if (dirty & /*serviceGroupObject*/ 64 && input1.value !== /*serviceGroupObject*/ ctx[6].port) {
    				set_input_value(input1, /*serviceGroupObject*/ ctx[6].port);
    			}

    			if (dirty & /*serviceGroupObject*/ 64 && input2.value !== /*serviceGroupObject*/ ctx[6].description) {
    				set_input_value(input2, /*serviceGroupObject*/ ctx[6].description);
    			}

    			if (dirty & /*sgoEdit*/ 4 && input3.value !== /*sgoEdit*/ ctx[2].id) {
    				set_input_value(input3, /*sgoEdit*/ ctx[2].id);
    			}

    			if (dirty & /*sgoEdit*/ 4 && input4.value !== /*sgoEdit*/ ctx[2].name) {
    				set_input_value(input4, /*sgoEdit*/ ctx[2].name);
    			}

    			if (dirty & /*sgoEdit*/ 4 && input5.value !== /*sgoEdit*/ ctx[2].port) {
    				set_input_value(input5, /*sgoEdit*/ ctx[2].port);
    			}

    			if (dirty & /*sgoEdit*/ 4 && input6.value !== /*sgoEdit*/ ctx[2].description) {
    				set_input_value(input6, /*sgoEdit*/ ctx[2].description);
    			}

    			if (dirty & /*sgoDelete*/ 8 && t56_value !== (t56_value = /*sgoDelete*/ ctx[3].name + "")) set_data_dev(t56, t56_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div16);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(div30);
    			if (detaching) detach_dev(t49);
    			if (detaching) detach_dev(div36);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let sort;
    	let $jwt_token;
    	let $isAuthenticated;
    	let $user;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(23, $jwt_token = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(4, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Service_Group_Objects', slots, []);
    	const api_root = window.location.origin + "/api";
    	let serviceGroupObjects = [];
    	let serviceGroupObject = { name: null, port: [], description: null };

    	let sgoEdit = {
    		id: null,
    		name: null,
    		port: [],
    		description: null
    	};

    	let portBeforeEdit = [];
    	let sgoDelete = { id: null, name: null };

    	function getServiceGroupObjects() {
    		var config = {
    			method: "get",
    			url: api_root + "/service-group-object",
    			headers: { Authorization: "Bearer " + $jwt_token }
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
    		$$invalidate(6, serviceGroupObject.port = port, serviceGroupObject);

    		var config = {
    			method: "post",
    			url: api_root + "/service-group-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: serviceGroupObject
    		};

    		axios(config).then(function (response) {
    			getServiceGroupObjects();
    		}).catch(function (error) {
    			alert("Could not create Service Group Objects");
    			console.log(error);
    		});

    		$$invalidate(6, serviceGroupObject = { name: null, port: [], description: null });
    	}

    	function getSgoToEdit(sgoE) {
    		$$invalidate(2, sgoEdit.id = sgoE.id, sgoEdit);
    		$$invalidate(2, sgoEdit.name = sgoE.name, sgoEdit);
    		$$invalidate(2, sgoEdit.port = sgoE.port, sgoEdit);
    		portBeforeEdit = sgoE.port;
    		$$invalidate(2, sgoEdit.description = sgoE.description, sgoEdit);
    	}

    	function editSGO() {
    		if (sgoEdit.port != portBeforeEdit) {
    			var port = sgoEdit.port.split(",");
    			$$invalidate(2, sgoEdit.port = port, sgoEdit);
    		}

    		var config = {
    			method: "put",
    			url: api_root + "/service-group-object",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: sgoEdit
    		};

    		axios(config).then(function (response) {
    			getServiceGroupObjects();
    		}).catch(function (error) {
    			alert("Could not edit Service Group Object");
    			console.log(error);
    		});
    	}

    	function getSgoToDelete(sgoD) {
    		$$invalidate(3, sgoDelete.id = sgoD.id, sgoDelete);
    		$$invalidate(3, sgoDelete.name = sgoD.name, sgoDelete);
    	}

    	function deleteSgo(id) {
    		var config = {
    			method: "delete",
    			url: api_root + "/service-group-object/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			getServiceGroupObjects();
    		}).catch(function (error) {
    			alert("Could not delete Service Group Object");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Service_Group_Objects> was created with unknown prop '${key}'`);
    	});

    	const click_handler = serviceGroupObject => getSgoToEdit(serviceGroupObject);
    	const click_handler_1 = serviceGroupObject => getSgoToDelete(serviceGroupObject);

    	function input0_input_handler() {
    		serviceGroupObject.name = this.value;
    		$$invalidate(6, serviceGroupObject);
    	}

    	function input1_input_handler() {
    		serviceGroupObject.port = this.value;
    		$$invalidate(6, serviceGroupObject);
    	}

    	function input2_input_handler() {
    		serviceGroupObject.description = this.value;
    		$$invalidate(6, serviceGroupObject);
    	}

    	function input3_input_handler() {
    		sgoEdit.id = this.value;
    		$$invalidate(2, sgoEdit);
    	}

    	function input4_input_handler() {
    		sgoEdit.name = this.value;
    		$$invalidate(2, sgoEdit);
    	}

    	function input5_input_handler() {
    		sgoEdit.port = this.value;
    		$$invalidate(2, sgoEdit);
    	}

    	function input6_input_handler() {
    		sgoEdit.description = this.value;
    		$$invalidate(2, sgoEdit);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		serviceGroupObjects,
    		serviceGroupObject,
    		sgoEdit,
    		portBeforeEdit,
    		sgoDelete,
    		getServiceGroupObjects,
    		createServiceGroupObject,
    		getSgoToEdit,
    		editSGO,
    		getSgoToDelete,
    		deleteSgo,
    		sortBy,
    		sort,
    		$jwt_token,
    		$isAuthenticated,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('serviceGroupObjects' in $$props) $$invalidate(0, serviceGroupObjects = $$props.serviceGroupObjects);
    		if ('serviceGroupObject' in $$props) $$invalidate(6, serviceGroupObject = $$props.serviceGroupObject);
    		if ('sgoEdit' in $$props) $$invalidate(2, sgoEdit = $$props.sgoEdit);
    		if ('portBeforeEdit' in $$props) portBeforeEdit = $$props.portBeforeEdit;
    		if ('sgoDelete' in $$props) $$invalidate(3, sgoDelete = $$props.sgoDelete);
    		if ('sortBy' in $$props) $$invalidate(12, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, serviceGroupObjects*/ 4097) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(12, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(12, sortBy.col = column, sortBy);
    					$$invalidate(12, sortBy.ascending = true, sortBy);
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
    		sgoEdit,
    		sgoDelete,
    		$isAuthenticated,
    		$user,
    		serviceGroupObject,
    		createServiceGroupObject,
    		getSgoToEdit,
    		editSGO,
    		getSgoToDelete,
    		deleteSgo,
    		sortBy,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler
    	];
    }

    class Service_Group_Objects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Service_Group_Objects",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Use-Cases.svelte generated by Svelte v3.53.1 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\pages\\Use-Cases.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    // (162:6) {#if $isAuthenticated}
    function create_if_block_3$1(ctx) {
    	let show_if = /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("helpdesk");
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_4$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$isAuthenticated, $user*/ 48) show_if = /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("helpdesk");

    			if (show_if) {
    				if (if_block) ; else {
    					if_block = create_if_block_4$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(162:6) {#if $isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (163:8) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_4$1(ctx) {
    	let div;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Add Use Case";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-toggle", "modal");
    			attr_dev(button, "data-target", "#crateUC");
    			set_style(button, "margin-top", "9px");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			add_location(button, file$2, 164, 12, 3993);
    			attr_dev(div, "class", "col");
    			set_style(div, "text-align-last", "right");
    			add_location(div, file$2, 163, 10, 3930);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(163:8) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (189:8) {#if $isAuthenticated}
    function create_if_block_2$1(ctx) {
    	let th0;
    	let t;
    	let th1;

    	const block = {
    		c: function create() {
    			th0 = element("th");
    			t = space();
    			th1 = element("th");
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$2, 189, 10, 4779);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$2, 190, 10, 4809);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, th1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(th1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(189:8) {#if $isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (201:13) {#each useCase.tags as tags}
    function create_each_block_1$1(ctx) {
    	let t0_value = /*tags*/ ctx[28] + "";
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
    			if (dirty & /*useCases*/ 1 && t0_value !== (t0_value = /*tags*/ ctx[28] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(201:13) {#each useCase.tags as tags}",
    		ctx
    	});

    	return block;
    }

    // (205:10) {#if $isAuthenticated}
    function create_if_block$2(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*$isAuthenticated, $user*/ 48) show_if = null;
    		if (show_if == null) show_if = !!(/*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("admin") || /*$isAuthenticated*/ ctx[4] && /*$user*/ ctx[5].user_roles && /*$user*/ ctx[5].user_roles.includes("helpdesk"));
    		if (show_if) return create_if_block_1$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(205:10) {#if $isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (229:12) {:else}
    function create_else_block$1(ctx) {
    	let td0;
    	let t;
    	let td1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			t = space();
    			td1 = element("td");
    			add_location(td0, file$2, 229, 14, 6202);
    			add_location(td1, file$2, 230, 14, 6224);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(229:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (206:12) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
    function create_if_block_1$2(ctx) {
    	let td0;
    	let button0;
    	let i0;
    	let t;
    	let td1;
    	let button1;
    	let i1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[13](/*useCase*/ ctx[6]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[14](/*useCase*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			i0 = element("i");
    			t = space();
    			td1 = element("td");
    			button1 = element("button");
    			i1 = element("i");
    			attr_dev(i0, "class", "fa fa-pencil-square-o fa-lg");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$2, 212, 19, 5607);
    			set_style(button0, "border", "none");
    			set_style(button0, "background", "none");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#editUC");
    			add_location(button0, file$2, 207, 17, 5378);
    			add_location(td0, file$2, 206, 14, 5356);
    			attr_dev(i1, "class", "fa fa-trash-o fa-lg");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$2, 225, 18, 6065);
    			set_style(button1, "border", "none");
    			set_style(button1, "background", "none");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#deleteUC");
    			add_location(button1, file$2, 219, 17, 5814);
    			add_location(td1, file$2, 218, 14, 5792);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    			append_dev(button1, i1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(206:12) {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"helpdesk\\\"))}",
    		ctx
    	});

    	return block;
    }

    // (196:6) {#each useCases as useCase}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*useCase*/ ctx[6].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*useCase*/ ctx[6].description + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4;
    	let t5;
    	let each_value_1 = /*useCase*/ ctx[6].tags;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block = /*$isAuthenticated*/ ctx[4] && create_if_block$2(ctx);

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
    			if (if_block) if_block.c();
    			t5 = space();
    			add_location(td0, file$2, 197, 10, 4943);
    			add_location(td1, file$2, 198, 10, 4978);
    			add_location(td2, file$2, 199, 10, 5020);
    			add_location(tr, file$2, 196, 8, 4927);
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
    			if (if_block) if_block.m(tr, null);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*useCases*/ 1 && t0_value !== (t0_value = /*useCase*/ ctx[6].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*useCases*/ 1 && t2_value !== (t2_value = /*useCase*/ ctx[6].description + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*useCases*/ 1) {
    				each_value_1 = /*useCase*/ ctx[6].tags;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*$isAuthenticated*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(tr, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(196:6) {#each useCases as useCase}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t4;
    	let span0;
    	let i;
    	let t5;
    	let th1;
    	let t7;
    	let th2;
    	let t9;
    	let t10;
    	let tbody;
    	let t11;
    	let div16;
    	let div15;
    	let div14;
    	let div5;
    	let h50;
    	let t13;
    	let button0;
    	let span1;
    	let t15;
    	let div12;
    	let form0;
    	let div7;
    	let div6;
    	let label0;
    	let t17;
    	let input0;
    	let t18;
    	let div9;
    	let div8;
    	let label1;
    	let t20;
    	let input1;
    	let t21;
    	let div11;
    	let div10;
    	let label2;
    	let t23;
    	let input2;
    	let t24;
    	let div13;
    	let button1;
    	let t26;
    	let button2;
    	let t28;
    	let div30;
    	let div29;
    	let div28;
    	let div17;
    	let h51;
    	let t30;
    	let button3;
    	let span2;
    	let t32;
    	let div26;
    	let form1;
    	let div19;
    	let div18;
    	let label3;
    	let t34;
    	let input3;
    	let t35;
    	let div21;
    	let div20;
    	let label4;
    	let t37;
    	let input4;
    	let t38;
    	let div23;
    	let div22;
    	let label5;
    	let t40;
    	let input5;
    	let t41;
    	let div25;
    	let div24;
    	let label6;
    	let t43;
    	let input6;
    	let t44;
    	let div27;
    	let button4;
    	let t46;
    	let button5;
    	let t48;
    	let div36;
    	let div35;
    	let div34;
    	let div31;
    	let h52;
    	let t50;
    	let button6;
    	let span3;
    	let t52;
    	let div32;
    	let t53;
    	let strong;
    	let t54;
    	let t55_value = /*useCaseDelete*/ ctx[3].name + "";
    	let t55;
    	let t56;
    	let t57;
    	let t58;
    	let div33;
    	let button7;
    	let t60;
    	let button8;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$isAuthenticated*/ ctx[4] && create_if_block_3$1(ctx);
    	let if_block1 = /*$isAuthenticated*/ ctx[4] && create_if_block_2$1(ctx);
    	let each_value = /*useCases*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Use Cases";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t4 = text("Name ");
    			span0 = element("span");
    			i = element("i");
    			t5 = space();
    			th1 = element("th");
    			th1.textContent = "Description";
    			t7 = space();
    			th2 = element("th");
    			th2.textContent = "Tags (Standort/Bereich)";
    			t9 = space();
    			if (if_block1) if_block1.c();
    			t10 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Add Use-Case";
    			t13 = space();
    			button0 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t15 = space();
    			div12 = element("div");
    			form0 = element("form");
    			div7 = element("div");
    			div6 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t17 = space();
    			input0 = element("input");
    			t18 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label1 = element("label");
    			label1.textContent = "Description";
    			t20 = space();
    			input1 = element("input");
    			t21 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label2 = element("label");
    			label2.textContent = "Tags (Standort/Organisation)";
    			t23 = space();
    			input2 = element("input");
    			t24 = space();
    			div13 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close";
    			t26 = space();
    			button2 = element("button");
    			button2.textContent = "Add";
    			t28 = space();
    			div30 = element("div");
    			div29 = element("div");
    			div28 = element("div");
    			div17 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Edit Use-Case";
    			t30 = space();
    			button3 = element("button");
    			span2 = element("span");
    			span2.textContent = "×";
    			t32 = space();
    			div26 = element("div");
    			form1 = element("form");
    			div19 = element("div");
    			div18 = element("div");
    			label3 = element("label");
    			label3.textContent = "Id";
    			t34 = space();
    			input3 = element("input");
    			t35 = space();
    			div21 = element("div");
    			div20 = element("div");
    			label4 = element("label");
    			label4.textContent = "Name";
    			t37 = space();
    			input4 = element("input");
    			t38 = space();
    			div23 = element("div");
    			div22 = element("div");
    			label5 = element("label");
    			label5.textContent = "Description";
    			t40 = space();
    			input5 = element("input");
    			t41 = space();
    			div25 = element("div");
    			div24 = element("div");
    			label6 = element("label");
    			label6.textContent = "Tags (Standort/Organisation)";
    			t43 = space();
    			input6 = element("input");
    			t44 = space();
    			div27 = element("div");
    			button4 = element("button");
    			button4.textContent = "Close";
    			t46 = space();
    			button5 = element("button");
    			button5.textContent = "Edit";
    			t48 = space();
    			div36 = element("div");
    			div35 = element("div");
    			div34 = element("div");
    			div31 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Delete Use-Case";
    			t50 = space();
    			button6 = element("button");
    			span3 = element("span");
    			span3.textContent = "×";
    			t52 = space();
    			div32 = element("div");
    			t53 = text("Are you sure, that you want to delete this use case ");
    			strong = element("strong");
    			t54 = text("\"");
    			t55 = text(t55_value);
    			t56 = text("\"");
    			t57 = text("?");
    			t58 = space();
    			div33 = element("div");
    			button7 = element("button");
    			button7.textContent = "Close";
    			t60 = space();
    			button8 = element("button");
    			button8.textContent = "Delete";
    			set_style(h3, "margin-top", "15px");
    			set_style(h3, "font-weight", "bold");
    			add_location(h3, file$2, 158, 8, 3609);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$2, 157, 6, 3582);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$2, 160, 6, 3694);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$2, 156, 4, 3557);
    			attr_dev(div3, "class", "container-fluid");
    			add_location(div3, file$2, 155, 2, 3522);
    			attr_dev(i, "class", "fa fa-fw fa-sort");
    			add_location(i, file$2, 183, 12, 4574);
    			add_location(span0, file$2, 182, 16, 4530);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$2, 181, 8, 4497);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$2, 186, 8, 4648);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$2, 187, 8, 4691);
    			add_location(tr, file$2, 179, 6, 4417);
    			add_location(thead, file$2, 178, 4, 4402);
    			add_location(tbody, file$2, 194, 4, 4875);
    			attr_dev(table, "class", "table table-striped table-hover");
    			attr_dev(table, "id", "allUseCases");
    			add_location(table, file$2, 177, 2, 4332);
    			set_style(div4, "margin-left", "-52px");
    			set_style(div4, "margin-right", "-52px");
    			add_location(div4, file$2, 154, 0, 3464);
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "crateUseCase");
    			add_location(h50, file$2, 250, 8, 6619);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$2, 257, 10, 6830);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$2, 251, 8, 6688);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$2, 249, 6, 6583);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$2, 264, 14, 7044);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$2, 265, 14, 7109);
    			attr_dev(div6, "class", "col");
    			add_location(div6, file$2, 263, 12, 7011);
    			attr_dev(div7, "class", "row mb-3");
    			add_location(div7, file$2, 262, 10, 6975);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$2, 275, 14, 7389);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "description");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$2, 276, 14, 7468);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$2, 274, 12, 7356);
    			attr_dev(div9, "class", "row mb-3");
    			add_location(div9, file$2, 273, 10, 7320);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "description");
    			add_location(label2, file$2, 286, 14, 7762);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "tag");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$2, 289, 14, 7892);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$2, 285, 12, 7729);
    			attr_dev(div11, "class", "row mb-3");
    			add_location(div11, file$2, 284, 10, 7693);
    			attr_dev(form0, "class", "mb-5");
    			add_location(form0, file$2, 261, 8, 6944);
    			attr_dev(div12, "class", "modal-body");
    			add_location(div12, file$2, 260, 6, 6910);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-dismiss", "modal");
    			add_location(button1, file$2, 300, 8, 8165);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn");
    			attr_dev(button2, "data-dismiss", "modal");
    			set_style(button2, "background-color", "#008000");
    			set_style(button2, "color", "#fff");
    			add_location(button2, file$2, 303, 8, 8280);
    			attr_dev(div13, "class", "modal-footer");
    			add_location(div13, file$2, 299, 6, 8129);
    			attr_dev(div14, "class", "modal-content");
    			add_location(div14, file$2, 248, 4, 6548);
    			attr_dev(div15, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div15, "role", "document");
    			add_location(div15, file$2, 247, 2, 6478);
    			attr_dev(div16, "class", "modal fade");
    			attr_dev(div16, "id", "crateUC");
    			attr_dev(div16, "tabindex", "-1");
    			attr_dev(div16, "role", "dialog");
    			attr_dev(div16, "aria-labelledby", "formCreateUseCase");
    			attr_dev(div16, "aria-hidden", "true");
    			add_location(div16, file$2, 239, 0, 6334);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "editUseCase");
    			add_location(h51, file$2, 326, 8, 8814);
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$2, 333, 10, 9025);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "close");
    			attr_dev(button3, "data-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$2, 327, 8, 8883);
    			attr_dev(div17, "class", "modal-header");
    			add_location(div17, file$2, 325, 6, 8778);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "id");
    			add_location(label3, file$2, 340, 14, 9239);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "id");
    			attr_dev(input3, "type", "text");
    			input3.disabled = true;
    			add_location(input3, file$2, 341, 14, 9300);
    			attr_dev(div18, "class", "col");
    			add_location(div18, file$2, 339, 12, 9206);
    			attr_dev(div19, "class", "row mb-3");
    			add_location(div19, file$2, 338, 10, 9170);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "name");
    			add_location(label4, file$2, 352, 14, 9606);
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "name");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$2, 353, 14, 9671);
    			attr_dev(div20, "class", "col");
    			add_location(div20, file$2, 351, 12, 9573);
    			attr_dev(div21, "class", "row mb-3");
    			add_location(div21, file$2, 350, 10, 9537);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "description");
    			add_location(label5, file$2, 363, 14, 9955);
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "id", "description");
    			attr_dev(input5, "type", "text");
    			add_location(input5, file$2, 364, 14, 10034);
    			attr_dev(div22, "class", "col");
    			add_location(div22, file$2, 362, 12, 9922);
    			attr_dev(div23, "class", "row mb-3");
    			add_location(div23, file$2, 361, 10, 9886);
    			attr_dev(label6, "class", "form-label");
    			attr_dev(label6, "for", "tags");
    			add_location(label6, file$2, 374, 14, 10332);
    			attr_dev(input6, "class", "form-control");
    			attr_dev(input6, "id", "tags");
    			attr_dev(input6, "type", "text");
    			add_location(input6, file$2, 377, 14, 10455);
    			attr_dev(div24, "class", "col");
    			add_location(div24, file$2, 373, 12, 10299);
    			attr_dev(div25, "class", "row mb-3");
    			add_location(div25, file$2, 372, 10, 10263);
    			attr_dev(form1, "class", "mb-5");
    			add_location(form1, file$2, 337, 8, 9139);
    			attr_dev(div26, "class", "modal-body");
    			add_location(div26, file$2, 336, 6, 9105);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-secondary");
    			attr_dev(button4, "data-dismiss", "modal");
    			add_location(button4, file$2, 388, 8, 10733);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			attr_dev(button5, "data-dismiss", "modal");
    			set_style(button5, "background-color", "#008000");
    			set_style(button5, "color", "#fff");
    			add_location(button5, file$2, 391, 8, 10848);
    			attr_dev(div27, "class", "modal-footer");
    			add_location(div27, file$2, 387, 6, 10697);
    			attr_dev(div28, "class", "modal-content");
    			add_location(div28, file$2, 324, 4, 8743);
    			attr_dev(div29, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div29, "role", "document");
    			add_location(div29, file$2, 323, 2, 8673);
    			attr_dev(div30, "class", "modal fade");
    			attr_dev(div30, "id", "editUC");
    			attr_dev(div30, "tabindex", "-1");
    			attr_dev(div30, "role", "dialog");
    			attr_dev(div30, "aria-labelledby", "formEditUseCase");
    			attr_dev(div30, "aria-hidden", "true");
    			add_location(div30, file$2, 315, 0, 8532);
    			attr_dev(h52, "class", "modal-title");
    			attr_dev(h52, "id", "deleteUseCase");
    			add_location(h52, file$2, 414, 8, 11385);
    			attr_dev(span3, "aria-hidden", "true");
    			add_location(span3, file$2, 421, 10, 11600);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "close");
    			attr_dev(button6, "data-dismiss", "modal");
    			attr_dev(button6, "aria-label", "Close");
    			add_location(button6, file$2, 415, 8, 11458);
    			attr_dev(div31, "class", "modal-header");
    			add_location(div31, file$2, 413, 6, 11349);
    			add_location(strong, file$2, 425, 60, 11766);
    			attr_dev(div32, "class", "modal-body");
    			add_location(div32, file$2, 424, 6, 11680);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-secondary");
    			attr_dev(button7, "data-dismiss", "modal");
    			add_location(button7, file$2, 430, 8, 11886);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn");
    			attr_dev(button8, "data-dismiss", "modal");
    			set_style(button8, "background-color", "#c73834");
    			set_style(button8, "color", "#fff");
    			add_location(button8, file$2, 433, 8, 12001);
    			attr_dev(div33, "class", "modal-footer");
    			add_location(div33, file$2, 429, 6, 11850);
    			attr_dev(div34, "class", "modal-content");
    			add_location(div34, file$2, 412, 4, 11314);
    			attr_dev(div35, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div35, "role", "document");
    			add_location(div35, file$2, 411, 2, 11244);
    			attr_dev(div36, "class", "modal fade");
    			attr_dev(div36, "id", "deleteUC");
    			attr_dev(div36, "tabindex", "-1");
    			attr_dev(div36, "role", "dialog");
    			attr_dev(div36, "aria-labelledby", "formDeleteUseCase");
    			attr_dev(div36, "aria-hidden", "true");
    			add_location(div36, file$2, 403, 0, 11099);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div4, t3);
    			append_dev(div4, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t4);
    			append_dev(th0, span0);
    			append_dev(span0, i);
    			append_dev(tr, t5);
    			append_dev(tr, th1);
    			append_dev(tr, t7);
    			append_dev(tr, th2);
    			append_dev(tr, t9);
    			if (if_block1) if_block1.m(tr, null);
    			append_dev(table, t10);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t11, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			append_dev(div5, h50);
    			append_dev(div5, t13);
    			append_dev(div5, button0);
    			append_dev(button0, span1);
    			append_dev(div14, t15);
    			append_dev(div14, div12);
    			append_dev(div12, form0);
    			append_dev(form0, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(div6, t17);
    			append_dev(div6, input0);
    			set_input_value(input0, /*useCase*/ ctx[6].name);
    			append_dev(form0, t18);
    			append_dev(form0, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label1);
    			append_dev(div8, t20);
    			append_dev(div8, input1);
    			set_input_value(input1, /*useCase*/ ctx[6].description);
    			append_dev(form0, t21);
    			append_dev(form0, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label2);
    			append_dev(div10, t23);
    			append_dev(div10, input2);
    			set_input_value(input2, /*useCase*/ ctx[6].tags);
    			append_dev(div14, t24);
    			append_dev(div14, div13);
    			append_dev(div13, button1);
    			append_dev(div13, t26);
    			append_dev(div13, button2);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, div30, anchor);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div17);
    			append_dev(div17, h51);
    			append_dev(div17, t30);
    			append_dev(div17, button3);
    			append_dev(button3, span2);
    			append_dev(div28, t32);
    			append_dev(div28, div26);
    			append_dev(div26, form1);
    			append_dev(form1, div19);
    			append_dev(div19, div18);
    			append_dev(div18, label3);
    			append_dev(div18, t34);
    			append_dev(div18, input3);
    			set_input_value(input3, /*useCaseEdit*/ ctx[2].id);
    			append_dev(form1, t35);
    			append_dev(form1, div21);
    			append_dev(div21, div20);
    			append_dev(div20, label4);
    			append_dev(div20, t37);
    			append_dev(div20, input4);
    			set_input_value(input4, /*useCaseEdit*/ ctx[2].name);
    			append_dev(form1, t38);
    			append_dev(form1, div23);
    			append_dev(div23, div22);
    			append_dev(div22, label5);
    			append_dev(div22, t40);
    			append_dev(div22, input5);
    			set_input_value(input5, /*useCaseEdit*/ ctx[2].description);
    			append_dev(form1, t41);
    			append_dev(form1, div25);
    			append_dev(div25, div24);
    			append_dev(div24, label6);
    			append_dev(div24, t43);
    			append_dev(div24, input6);
    			set_input_value(input6, /*useCaseEdit*/ ctx[2].tags);
    			append_dev(div28, t44);
    			append_dev(div28, div27);
    			append_dev(div27, button4);
    			append_dev(div27, t46);
    			append_dev(div27, button5);
    			insert_dev(target, t48, anchor);
    			insert_dev(target, div36, anchor);
    			append_dev(div36, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div31);
    			append_dev(div31, h52);
    			append_dev(div31, t50);
    			append_dev(div31, button6);
    			append_dev(button6, span3);
    			append_dev(div34, t52);
    			append_dev(div34, div32);
    			append_dev(div32, t53);
    			append_dev(div32, strong);
    			append_dev(strong, t54);
    			append_dev(strong, t55);
    			append_dev(strong, t56);
    			append_dev(div32, t57);
    			append_dev(div34, t58);
    			append_dev(div34, div33);
    			append_dev(div33, button7);
    			append_dev(div33, t60);
    			append_dev(div33, button8);

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
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[17]),
    					listen_dev(button2, "click", /*createUseCase*/ ctx[7], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[18]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[19]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[20]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[21]),
    					listen_dev(button5, "click", /*editUseCase*/ ctx[9], false, false, false),
    					listen_dev(
    						button8,
    						"click",
    						function () {
    							if (is_function(/*deleteUseCase*/ ctx[11](/*useCaseDelete*/ ctx[3].id))) /*deleteUseCase*/ ctx[11](/*useCaseDelete*/ ctx[3].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*$isAuthenticated*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$isAuthenticated*/ ctx[4]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					if_block1.m(tr, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*getUseCaseToDelete, useCases, getUseCaseToEdit, $isAuthenticated, $user*/ 1329) {
    				each_value = /*useCases*/ ctx[0];
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

    			if (dirty & /*useCase*/ 64 && input0.value !== /*useCase*/ ctx[6].name) {
    				set_input_value(input0, /*useCase*/ ctx[6].name);
    			}

    			if (dirty & /*useCase*/ 64 && input1.value !== /*useCase*/ ctx[6].description) {
    				set_input_value(input1, /*useCase*/ ctx[6].description);
    			}

    			if (dirty & /*useCase*/ 64 && input2.value !== /*useCase*/ ctx[6].tags) {
    				set_input_value(input2, /*useCase*/ ctx[6].tags);
    			}

    			if (dirty & /*useCaseEdit*/ 4 && input3.value !== /*useCaseEdit*/ ctx[2].id) {
    				set_input_value(input3, /*useCaseEdit*/ ctx[2].id);
    			}

    			if (dirty & /*useCaseEdit*/ 4 && input4.value !== /*useCaseEdit*/ ctx[2].name) {
    				set_input_value(input4, /*useCaseEdit*/ ctx[2].name);
    			}

    			if (dirty & /*useCaseEdit*/ 4 && input5.value !== /*useCaseEdit*/ ctx[2].description) {
    				set_input_value(input5, /*useCaseEdit*/ ctx[2].description);
    			}

    			if (dirty & /*useCaseEdit*/ 4 && input6.value !== /*useCaseEdit*/ ctx[2].tags) {
    				set_input_value(input6, /*useCaseEdit*/ ctx[2].tags);
    			}

    			if (dirty & /*useCaseDelete*/ 8 && t55_value !== (t55_value = /*useCaseDelete*/ ctx[3].name + "")) set_data_dev(t55, t55_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div16);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(div30);
    			if (detaching) detach_dev(t48);
    			if (detaching) detach_dev(div36);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let sort;
    	let $jwt_token;
    	let $isAuthenticated;
    	let $user;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(23, $jwt_token = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(4, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Use_Cases', slots, []);
    	const api_root = window.location.origin + "/api";
    	let useCases = [];
    	let useCase = { name: null, description: null, tags: [] };

    	let useCaseEdit = {
    		id: null,
    		name: null,
    		description: null,
    		tags: []
    	};

    	let useCaseDelete = { id: null, name: null };
    	let tagsBeforeEdit = [];

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
    		$$invalidate(6, useCase.tags = tags, useCase);

    		var config = {
    			method: "post",
    			url: api_root + "/use-case",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: useCase
    		};

    		axios(config).then(function (response) {
    			getUseCases();
    		}).catch(function (error) {
    			alert("Could not create Use Case");
    			console.log(error);
    		});

    		$$invalidate(6, useCase = { name: null, description: null, tags: [] });
    	}

    	function getUseCaseToEdit(ucE) {
    		$$invalidate(2, useCaseEdit.id = ucE.id, useCaseEdit);
    		$$invalidate(2, useCaseEdit.name = ucE.name, useCaseEdit);
    		$$invalidate(2, useCaseEdit.description = ucE.description, useCaseEdit);
    		$$invalidate(2, useCaseEdit.tags = ucE.tags, useCaseEdit);
    		tagsBeforeEdit = ucE.tags;
    	}

    	function editUseCase() {
    		if (useCaseEdit.tags != tagsBeforeEdit) {
    			var tags = useCaseEdit.tags.split(",");
    			$$invalidate(2, useCaseEdit.tags = tags, useCaseEdit);
    		}

    		var config = {
    			method: "put",
    			url: api_root + "/use-case",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: useCaseEdit
    		};

    		axios(config).then(function (response) {
    			getUseCases();
    		}).catch(function (error) {
    			alert("Could not edit Use Case");
    			console.log(error);
    		});
    	}

    	function getUseCaseToDelete(ucD) {
    		$$invalidate(3, useCaseDelete.id = ucD.id, useCaseDelete);
    		$$invalidate(3, useCaseDelete.name = ucD.name, useCaseDelete);
    	}

    	function deleteUseCase(id) {
    		var config = {
    			method: "delete",
    			url: api_root + "/use-case/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			getUseCases();
    		}).catch(function (error) {
    			alert("Could not delete Use Case");
    			console.log(error);
    		});
    	}

    	let sortBy = { col: "name", ascending: true };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Use_Cases> was created with unknown prop '${key}'`);
    	});

    	const click_handler = useCase => getUseCaseToEdit(useCase);
    	const click_handler_1 = useCase => getUseCaseToDelete(useCase);

    	function input0_input_handler() {
    		useCase.name = this.value;
    		$$invalidate(6, useCase);
    	}

    	function input1_input_handler() {
    		useCase.description = this.value;
    		$$invalidate(6, useCase);
    	}

    	function input2_input_handler() {
    		useCase.tags = this.value;
    		$$invalidate(6, useCase);
    	}

    	function input3_input_handler() {
    		useCaseEdit.id = this.value;
    		$$invalidate(2, useCaseEdit);
    	}

    	function input4_input_handler() {
    		useCaseEdit.name = this.value;
    		$$invalidate(2, useCaseEdit);
    	}

    	function input5_input_handler() {
    		useCaseEdit.description = this.value;
    		$$invalidate(2, useCaseEdit);
    	}

    	function input6_input_handler() {
    		useCaseEdit.tags = this.value;
    		$$invalidate(2, useCaseEdit);
    	}

    	$$self.$capture_state = () => ({
    		axios,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		useCases,
    		useCase,
    		useCaseEdit,
    		useCaseDelete,
    		tagsBeforeEdit,
    		getUseCases,
    		createUseCase,
    		getUseCaseToEdit,
    		editUseCase,
    		getUseCaseToDelete,
    		deleteUseCase,
    		sortBy,
    		sort,
    		$jwt_token,
    		$isAuthenticated,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('useCases' in $$props) $$invalidate(0, useCases = $$props.useCases);
    		if ('useCase' in $$props) $$invalidate(6, useCase = $$props.useCase);
    		if ('useCaseEdit' in $$props) $$invalidate(2, useCaseEdit = $$props.useCaseEdit);
    		if ('useCaseDelete' in $$props) $$invalidate(3, useCaseDelete = $$props.useCaseDelete);
    		if ('tagsBeforeEdit' in $$props) tagsBeforeEdit = $$props.tagsBeforeEdit;
    		if ('sortBy' in $$props) $$invalidate(12, sortBy = $$props.sortBy);
    		if ('sort' in $$props) $$invalidate(1, sort = $$props.sort);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sortBy, useCases*/ 4097) {
    			$$invalidate(1, sort = column => {
    				if (sortBy.col == column) {
    					$$invalidate(12, sortBy.ascending = !sortBy.ascending, sortBy);
    				} else {
    					$$invalidate(12, sortBy.col = column, sortBy);
    					$$invalidate(12, sortBy.ascending = true, sortBy);
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
    		useCaseEdit,
    		useCaseDelete,
    		$isAuthenticated,
    		$user,
    		useCase,
    		createUseCase,
    		getUseCaseToEdit,
    		editUseCase,
    		getUseCaseToDelete,
    		deleteUseCase,
    		sortBy,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler
    	];
    }

    class Use_Cases extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Use_Cases",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Firewall-Rule-Details.svelte generated by Svelte v3.53.1 */

    const { console: console_1 } = globals;
    const file$1 = "src\\pages\\Firewall-Rule-Details.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    // (142:0) {#if success}
    function create_if_block$1(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let div4;
    	let div3;
    	let div1;
    	let t2;
    	let div2;
    	let h50;
    	let t4;
    	let p0;
    	let t5_value = /*firewallType*/ ctx[2].name + "";
    	let t5;
    	let t6;
    	let h51;
    	let t8;
    	let p1;
    	let t9_value = /*context*/ ctx[3].name + "";
    	let t9;
    	let t10;
    	let h52;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let h53;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let h54;
    	let t24;
    	let p2;
    	let t25_value = /*sgo*/ ctx[12].name + "";
    	let t25;
    	let t26;
    	let t27;
    	let h55;
    	let t29;
    	let p3;
    	let t30_value = /*uc*/ ctx[13].name + "";
    	let t30;
    	let t31;
    	let h56;
    	let t33;
    	let p4;
    	let t34_value = /*firewallRules*/ ctx[1].firewallStatus + "";
    	let t34;
    	let t35;
    	let show_if = /*$isAuthenticated*/ ctx[0] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin");
    	let if_block0 = /*sHo*/ ctx[4] && create_if_block_9(ctx);
    	let if_block1 = /*sHgoWithHo*/ ctx[5] && create_if_block_8(ctx);
    	let if_block2 = /*sNo*/ ctx[6] && create_if_block_7(ctx);
    	let if_block3 = /*sNgoWithNo*/ ctx[7] && create_if_block_6(ctx);
    	let if_block4 = /*dHo*/ ctx[8] && create_if_block_5(ctx);
    	let if_block5 = /*dHgoWithHo*/ ctx[9] && create_if_block_4(ctx);
    	let if_block6 = /*dNo*/ ctx[10] && create_if_block_3(ctx);
    	let if_block7 = /*dNgoWithNo*/ ctx[11] && create_if_block_2(ctx);
    	let each_value = /*sgo*/ ctx[12].port;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block8 = show_if && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "New Firewall Rule";
    			t2 = space();
    			div2 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Firewall Type";
    			t4 = space();
    			p0 = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			h51 = element("h5");
    			h51.textContent = "Context";
    			t8 = space();
    			p1 = element("p");
    			t9 = text(t9_value);
    			t10 = space();
    			h52 = element("h5");
    			h52.textContent = "Source";
    			t12 = space();
    			if (if_block0) if_block0.c();
    			t13 = space();
    			if (if_block1) if_block1.c();
    			t14 = space();
    			if (if_block2) if_block2.c();
    			t15 = space();
    			if (if_block3) if_block3.c();
    			t16 = space();
    			h53 = element("h5");
    			h53.textContent = "Destination";
    			t18 = space();
    			if (if_block4) if_block4.c();
    			t19 = space();
    			if (if_block5) if_block5.c();
    			t20 = space();
    			if (if_block6) if_block6.c();
    			t21 = space();
    			if (if_block7) if_block7.c();
    			t22 = space();
    			h54 = element("h5");
    			h54.textContent = "Service Group";
    			t24 = space();
    			p2 = element("p");
    			t25 = text(t25_value);
    			t26 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t27 = space();
    			h55 = element("h5");
    			h55.textContent = "Use Case";
    			t29 = space();
    			p3 = element("p");
    			t30 = text(t30_value);
    			t31 = space();
    			h56 = element("h5");
    			h56.textContent = "Status";
    			t33 = space();
    			p4 = element("p");
    			t34 = text(t34_value);
    			t35 = space();
    			if (if_block8) if_block8.c();
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$1, 143, 4, 3417);
    			attr_dev(div1, "class", "card-header");
    			set_style(div1, "font-size", "24px");
    			add_location(div1, file$1, 146, 8, 3521);
    			attr_dev(h50, "class", "card-title");
    			set_style(h50, "font-weight", "bold");
    			add_location(h50, file$1, 150, 10, 3661);
    			attr_dev(p0, "class", "card-text");
    			add_location(p0, file$1, 151, 10, 3741);
    			attr_dev(h51, "class", "card-title");
    			set_style(h51, "font-weight", "bold");
    			add_location(h51, file$1, 152, 10, 3797);
    			attr_dev(p1, "class", "card-text");
    			add_location(p1, file$1, 153, 10, 3871);
    			attr_dev(h52, "class", "card-title");
    			set_style(h52, "font-weight", "bold");
    			add_location(h52, file$1, 154, 10, 3922);
    			attr_dev(h53, "class", "card-title");
    			set_style(h53, "font-weight", "bold");
    			add_location(h53, file$1, 191, 10, 4947);
    			attr_dev(h54, "class", "card-title");
    			set_style(h54, "font-weight", "bold");
    			add_location(h54, file$1, 228, 10, 5977);
    			attr_dev(p2, "class", "card-text");
    			add_location(p2, file$1, 229, 10, 6057);
    			attr_dev(h55, "class", "card-title");
    			set_style(h55, "font-weight", "bold");
    			add_location(h55, file$1, 236, 10, 6227);
    			attr_dev(p3, "class", "card-text");
    			add_location(p3, file$1, 237, 10, 6302);
    			attr_dev(h56, "class", "card-title");
    			set_style(h56, "font-weight", "bold");
    			add_location(h56, file$1, 238, 10, 6348);
    			attr_dev(p4, "class", "card-text");
    			add_location(p4, file$1, 239, 10, 6421);
    			attr_dev(div2, "class", "card-body");
    			add_location(div2, file$1, 149, 8, 3626);
    			attr_dev(div3, "class", "card");
    			set_style(div3, "margin-top", "20px");
    			add_location(div3, file$1, 145, 6, 3467);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$1, 144, 4, 3442);
    			attr_dev(div5, "class", "row row-cols-1 row-cols-md-3 g-4");
    			add_location(div5, file$1, 142, 2, 3365);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, h50);
    			append_dev(div2, t4);
    			append_dev(div2, p0);
    			append_dev(p0, t5);
    			append_dev(div2, t6);
    			append_dev(div2, h51);
    			append_dev(div2, t8);
    			append_dev(div2, p1);
    			append_dev(p1, t9);
    			append_dev(div2, t10);
    			append_dev(div2, h52);
    			append_dev(div2, t12);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t13);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t14);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t15);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t16);
    			append_dev(div2, h53);
    			append_dev(div2, t18);
    			if (if_block4) if_block4.m(div2, null);
    			append_dev(div2, t19);
    			if (if_block5) if_block5.m(div2, null);
    			append_dev(div2, t20);
    			if (if_block6) if_block6.m(div2, null);
    			append_dev(div2, t21);
    			if (if_block7) if_block7.m(div2, null);
    			append_dev(div2, t22);
    			append_dev(div2, h54);
    			append_dev(div2, t24);
    			append_dev(div2, p2);
    			append_dev(p2, t25);
    			append_dev(p2, t26);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p2, null);
    			}

    			append_dev(div2, t27);
    			append_dev(div2, h55);
    			append_dev(div2, t29);
    			append_dev(div2, p3);
    			append_dev(p3, t30);
    			append_dev(div2, t31);
    			append_dev(div2, h56);
    			append_dev(div2, t33);
    			append_dev(div2, p4);
    			append_dev(p4, t34);
    			append_dev(div3, t35);
    			if (if_block8) if_block8.m(div3, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*firewallType*/ 4 && t5_value !== (t5_value = /*firewallType*/ ctx[2].name + "")) set_data_dev(t5, t5_value);
    			if (dirty[0] & /*context*/ 8 && t9_value !== (t9_value = /*context*/ ctx[3].name + "")) set_data_dev(t9, t9_value);

    			if (/*sHo*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					if_block0.m(div2, t13);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*sHgoWithHo*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_8(ctx);
    					if_block1.c();
    					if_block1.m(div2, t14);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*sNo*/ ctx[6]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_7(ctx);
    					if_block2.c();
    					if_block2.m(div2, t15);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*sNgoWithNo*/ ctx[7]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_6(ctx);
    					if_block3.c();
    					if_block3.m(div2, t16);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*dHo*/ ctx[8]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_5(ctx);
    					if_block4.c();
    					if_block4.m(div2, t19);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*dHgoWithHo*/ ctx[9]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_4(ctx);
    					if_block5.c();
    					if_block5.m(div2, t20);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*dNo*/ ctx[10]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_3(ctx);
    					if_block6.c();
    					if_block6.m(div2, t21);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*dNgoWithNo*/ ctx[11]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_2(ctx);
    					if_block7.c();
    					if_block7.m(div2, t22);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (dirty[0] & /*sgo*/ 4096 && t25_value !== (t25_value = /*sgo*/ ctx[12].name + "")) set_data_dev(t25, t25_value);

    			if (dirty[0] & /*sgo*/ 4096) {
    				each_value = /*sgo*/ ctx[12].port;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*uc*/ 8192 && t30_value !== (t30_value = /*uc*/ ctx[13].name + "")) set_data_dev(t30, t30_value);
    			if (dirty[0] & /*firewallRules*/ 2 && t34_value !== (t34_value = /*firewallRules*/ ctx[1].firewallStatus + "")) set_data_dev(t34, t34_value);
    			if (dirty[0] & /*$isAuthenticated, $user*/ 32769) show_if = /*$isAuthenticated*/ ctx[0] && /*$user*/ ctx[15].user_roles && /*$user*/ ctx[15].user_roles.includes("admin");

    			if (show_if) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_1$1(ctx);
    					if_block8.c();
    					if_block8.m(div3, null);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block8) if_block8.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(142:0) {#if success}",
    		ctx
    	});

    	return block;
    }

    // (156:10) {#if sHo}
    function create_if_block_9(ctx) {
    	let p;
    	let t0_value = /*sHo*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3_value = /*sHo*/ ctx[4].ip + "";
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			add_location(br, file$1, 158, 14, 4081);
    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 156, 12, 4018);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, br);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sHo*/ 16 && t0_value !== (t0_value = /*sHo*/ ctx[4].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*sHo*/ 16 && t3_value !== (t3_value = /*sHo*/ ctx[4].ip + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(156:10) {#if sHo}",
    		ctx
    	});

    	return block;
    }

    // (163:10) {#if sHgoWithHo}
    function create_if_block_8(ctx) {
    	let p;
    	let t0_value = /*sHgoWithHo*/ ctx[5].hgoName + "";
    	let t0;
    	let t1;
    	let each_value_4 = /*sHgoWithHo*/ ctx[5].members;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 163, 12, 4188);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sHgoWithHo*/ 32 && t0_value !== (t0_value = /*sHgoWithHo*/ ctx[5].hgoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*sHgoWithHo*/ 32) {
    				each_value_4 = /*sHgoWithHo*/ ctx[5].members;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(163:10) {#if sHgoWithHo}",
    		ctx
    	});

    	return block;
    }

    // (166:14) {#each sHgoWithHo.members as m}
    function create_each_block_4(ctx) {
    	let br0;
    	let t0;
    	let t1_value = /*m*/ ctx[27].name + "";
    	let t1;
    	let t2;
    	let br1;
    	let t3;
    	let t4_value = /*m*/ ctx[27].ip + "";
    	let t4;

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			br1 = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			add_location(br0, file$1, 166, 16, 4310);
    			add_location(br1, file$1, 168, 16, 4360);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sHgoWithHo*/ 32 && t1_value !== (t1_value = /*m*/ ctx[27].name + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*sHgoWithHo*/ 32 && t4_value !== (t4_value = /*m*/ ctx[27].ip + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(166:14) {#each sHgoWithHo.members as m}",
    		ctx
    	});

    	return block;
    }

    // (174:10) {#if sNo}
    function create_if_block_7(ctx) {
    	let p;
    	let t0_value = /*sNo*/ ctx[6].name + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3_value = /*sNo*/ ctx[6].ip + "";
    	let t3;
    	let t4_value = /*sNo*/ ctx[6].subnet + "";
    	let t4;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = text(t4_value);
    			add_location(br, file$1, 176, 14, 4546);
    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 174, 12, 4483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, br);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sNo*/ 64 && t0_value !== (t0_value = /*sNo*/ ctx[6].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*sNo*/ 64 && t3_value !== (t3_value = /*sNo*/ ctx[6].ip + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*sNo*/ 64 && t4_value !== (t4_value = /*sNo*/ ctx[6].subnet + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(174:10) {#if sNo}",
    		ctx
    	});

    	return block;
    }

    // (181:10) {#if sNgoWithNo}
    function create_if_block_6(ctx) {
    	let p;
    	let t0_value = /*sNgoWithNo*/ ctx[7].ngoName + "";
    	let t0;
    	let t1;
    	let each_value_3 = /*sNgoWithNo*/ ctx[7].members;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 181, 12, 4665);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sNgoWithNo*/ 128 && t0_value !== (t0_value = /*sNgoWithNo*/ ctx[7].ngoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*sNgoWithNo*/ 128) {
    				each_value_3 = /*sNgoWithNo*/ ctx[7].members;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(181:10) {#if sNgoWithNo}",
    		ctx
    	});

    	return block;
    }

    // (184:14) {#each sNgoWithNo.members as m}
    function create_each_block_3(ctx) {
    	let br0;
    	let t0;
    	let t1_value = /*m*/ ctx[27].name + "";
    	let t1;
    	let t2;
    	let br1;
    	let t3;
    	let t4_value = /*m*/ ctx[27].ip + "";
    	let t4;
    	let t5_value = /*m*/ ctx[27].subnet + "";
    	let t5;

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			br1 = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = text(t5_value);
    			add_location(br0, file$1, 184, 16, 4787);
    			add_location(br1, file$1, 186, 16, 4837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sNgoWithNo*/ 128 && t1_value !== (t1_value = /*m*/ ctx[27].name + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*sNgoWithNo*/ 128 && t4_value !== (t4_value = /*m*/ ctx[27].ip + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*sNgoWithNo*/ 128 && t5_value !== (t5_value = /*m*/ ctx[27].subnet + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(184:14) {#each sNgoWithNo.members as m}",
    		ctx
    	});

    	return block;
    }

    // (193:10) {#if dHo}
    function create_if_block_5(ctx) {
    	let p;
    	let t0_value = /*dHo*/ ctx[8].name + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3_value = /*dHo*/ ctx[8].ip + "";
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			add_location(br, file$1, 195, 14, 5111);
    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 193, 12, 5048);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, br);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dHo*/ 256 && t0_value !== (t0_value = /*dHo*/ ctx[8].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*dHo*/ 256 && t3_value !== (t3_value = /*dHo*/ ctx[8].ip + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(193:10) {#if dHo}",
    		ctx
    	});

    	return block;
    }

    // (200:10) {#if dHgoWithHo}
    function create_if_block_4(ctx) {
    	let p;
    	let t0_value = /*dHgoWithHo*/ ctx[9].hgoName + "";
    	let t0;
    	let t1;
    	let each_value_2 = /*dHgoWithHo*/ ctx[9].members;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 200, 12, 5218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dHgoWithHo*/ 512 && t0_value !== (t0_value = /*dHgoWithHo*/ ctx[9].hgoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*dHgoWithHo*/ 512) {
    				each_value_2 = /*dHgoWithHo*/ ctx[9].members;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(200:10) {#if dHgoWithHo}",
    		ctx
    	});

    	return block;
    }

    // (203:14) {#each dHgoWithHo.members as m}
    function create_each_block_2(ctx) {
    	let br0;
    	let t0;
    	let t1_value = /*m*/ ctx[27].name + "";
    	let t1;
    	let t2;
    	let br1;
    	let t3;
    	let t4_value = /*m*/ ctx[27].ip + "";
    	let t4;

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			br1 = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			add_location(br0, file$1, 203, 16, 5340);
    			add_location(br1, file$1, 205, 16, 5390);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dHgoWithHo*/ 512 && t1_value !== (t1_value = /*m*/ ctx[27].name + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*dHgoWithHo*/ 512 && t4_value !== (t4_value = /*m*/ ctx[27].ip + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(203:14) {#each dHgoWithHo.members as m}",
    		ctx
    	});

    	return block;
    }

    // (211:10) {#if dNo}
    function create_if_block_3(ctx) {
    	let p;
    	let t0_value = /*dNo*/ ctx[10].name + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3_value = /*dNo*/ ctx[10].ip + "";
    	let t3;
    	let t4_value = /*dNo*/ ctx[10].subnet + "";
    	let t4;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = text(t4_value);
    			add_location(br, file$1, 213, 14, 5576);
    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 211, 12, 5513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, br);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dNo*/ 1024 && t0_value !== (t0_value = /*dNo*/ ctx[10].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*dNo*/ 1024 && t3_value !== (t3_value = /*dNo*/ ctx[10].ip + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*dNo*/ 1024 && t4_value !== (t4_value = /*dNo*/ ctx[10].subnet + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(211:10) {#if dNo}",
    		ctx
    	});

    	return block;
    }

    // (218:10) {#if dNgoWithNo}
    function create_if_block_2(ctx) {
    	let p;
    	let t0_value = /*dNgoWithNo*/ ctx[11].ngoName + "";
    	let t0;
    	let t1;
    	let each_value_1 = /*dNgoWithNo*/ ctx[11].members;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "card-text");
    			add_location(p, file$1, 218, 12, 5695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dNgoWithNo*/ 2048 && t0_value !== (t0_value = /*dNgoWithNo*/ ctx[11].ngoName + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*dNgoWithNo*/ 2048) {
    				each_value_1 = /*dNgoWithNo*/ ctx[11].members;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(218:10) {#if dNgoWithNo}",
    		ctx
    	});

    	return block;
    }

    // (221:14) {#each dNgoWithNo.members as m}
    function create_each_block_1(ctx) {
    	let br0;
    	let t0;
    	let t1_value = /*m*/ ctx[27].name + "";
    	let t1;
    	let t2;
    	let br1;
    	let t3;
    	let t4_value = /*m*/ ctx[27].ip + "";
    	let t4;
    	let t5_value = /*m*/ ctx[27].subnet + "";
    	let t5;

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			br1 = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = text(t5_value);
    			add_location(br0, file$1, 221, 16, 5817);
    			add_location(br1, file$1, 223, 16, 5867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dNgoWithNo*/ 2048 && t1_value !== (t1_value = /*m*/ ctx[27].name + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*dNgoWithNo*/ 2048 && t4_value !== (t4_value = /*m*/ ctx[27].ip + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*dNgoWithNo*/ 2048 && t5_value !== (t5_value = /*m*/ ctx[27].subnet + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(221:14) {#each dNgoWithNo.members as m}",
    		ctx
    	});

    	return block;
    }

    // (232:12) {#each sgo.port as p}
    function create_each_block(ctx) {
    	let br;
    	let t0;
    	let t1_value = /*p*/ ctx[24] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			br = element("br");
    			t0 = space();
    			t1 = text(t1_value);
    			add_location(br, file$1, 232, 14, 6153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sgo*/ 4096 && t1_value !== (t1_value = /*p*/ ctx[24] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(232:12) {#each sgo.port as p}",
    		ctx
    	});

    	return block;
    }

    // (242:8) {#if $isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")}
    function create_if_block_1$1(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Reject";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Approve";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-toggle", "modal");
    			attr_dev(button0, "data-target", "#reject");
    			attr_dev(button0, "class", "btn");
    			set_style(button0, "background-color", "#c73834");
    			set_style(button0, "color", "#fff");
    			add_location(button0, file$1, 243, 10, 6629);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-toggle", "modal");
    			attr_dev(button1, "data-target", "#approve");
    			attr_dev(button1, "class", "btn btn-success");
    			set_style(button1, "color", "#fff");
    			add_location(button1, file$1, 251, 10, 6918);
    			attr_dev(div, "class", "card-footer");
    			add_location(div, file$1, 242, 8, 6592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*changeFwStatusRejected*/ ctx[17](/*firewallRules*/ ctx[1]))) /*changeFwStatusRejected*/ ctx[17](/*firewallRules*/ ctx[1]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*changeFwStatusApproved*/ ctx[16](/*firewallRules*/ ctx[1]))) /*changeFwStatusApproved*/ ctx[16](/*firewallRules*/ ctx[1]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(242:8) {#if $isAuthenticated && $user.user_roles && $user.user_roles.includes(\\\"admin\\\")}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let div5;
    	let div4;
    	let div3;
    	let div0;
    	let h50;
    	let t2;
    	let button0;
    	let span0;
    	let t4;
    	let div2;
    	let p0;
    	let t6;
    	let div1;
    	let button1;
    	let t8;
    	let button2;
    	let t10;
    	let div11;
    	let div10;
    	let div9;
    	let div6;
    	let h51;
    	let t12;
    	let button3;
    	let span1;
    	let t14;
    	let div8;
    	let p1;
    	let t16;
    	let div7;
    	let button4;
    	let t18;
    	let button5;
    	let if_block = /*success*/ ctx[14] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Rejected";
    			t2 = space();
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "×";
    			t4 = space();
    			div2 = element("div");
    			p0 = element("p");
    			p0.textContent = "This firewall rule has been rejected";
    			t6 = space();
    			div1 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close";
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "OK";
    			t10 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div6 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Approved";
    			t12 = space();
    			button3 = element("button");
    			span1 = element("span");
    			span1.textContent = "×";
    			t14 = space();
    			div8 = element("div");
    			p1 = element("p");
    			p1.textContent = "This firewall rule has been approved";
    			t16 = space();
    			div7 = element("div");
    			button4 = element("button");
    			button4.textContent = "Close";
    			t18 = space();
    			button5 = element("button");
    			button5.textContent = "OK";
    			attr_dev(h50, "class", "modal-title");
    			attr_dev(h50, "id", "reject");
    			add_location(h50, file$1, 275, 8, 7503);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$1, 282, 10, 7704);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			attr_dev(button0, "data-dismiss", "modal");
    			attr_dev(button0, "aria-label", "Close");
    			add_location(button0, file$1, 276, 8, 7562);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$1, 274, 6, 7467);
    			add_location(p0, file$1, 286, 8, 7818);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-secondary");
    			attr_dev(button1, "data-dismiss", "modal");
    			add_location(button1, file$1, 288, 10, 7909);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn");
    			attr_dev(button2, "data-dismiss", "modal");
    			set_style(button2, "background-color", "#c73834");
    			set_style(button2, "color", "#fff");
    			add_location(button2, file$1, 291, 10, 8030);
    			attr_dev(div1, "class", "modal-footer");
    			add_location(div1, file$1, 287, 8, 7871);
    			attr_dev(div2, "class", "modal-body");
    			add_location(div2, file$1, 285, 6, 7784);
    			attr_dev(div3, "class", "modal-content");
    			add_location(div3, file$1, 273, 4, 7432);
    			attr_dev(div4, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div4, "role", "document");
    			add_location(div4, file$1, 272, 2, 7362);
    			attr_dev(div5, "class", "modal fade");
    			attr_dev(div5, "id", "reject");
    			attr_dev(div5, "tabindex", "-1");
    			attr_dev(div5, "role", "dialog");
    			attr_dev(div5, "aria-hidden", "true");
    			add_location(div5, file$1, 265, 0, 7258);
    			attr_dev(h51, "class", "modal-title");
    			attr_dev(h51, "id", "approve");
    			add_location(h51, file$1, 313, 8, 8517);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$1, 320, 10, 8719);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "close");
    			attr_dev(button3, "data-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$1, 314, 8, 8577);
    			attr_dev(div6, "class", "modal-header");
    			add_location(div6, file$1, 312, 6, 8481);
    			add_location(p1, file$1, 324, 8, 8833);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-secondary");
    			attr_dev(button4, "data-dismiss", "modal");
    			add_location(button4, file$1, 326, 10, 8924);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn");
    			attr_dev(button5, "data-dismiss", "modal");
    			set_style(button5, "background-color", "#c73834");
    			set_style(button5, "color", "#fff");
    			add_location(button5, file$1, 329, 10, 9045);
    			attr_dev(div7, "class", "modal-footer");
    			add_location(div7, file$1, 325, 8, 8886);
    			attr_dev(div8, "class", "modal-body");
    			add_location(div8, file$1, 323, 6, 8799);
    			attr_dev(div9, "class", "modal-content");
    			add_location(div9, file$1, 311, 4, 8446);
    			attr_dev(div10, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div10, "role", "document");
    			add_location(div10, file$1, 310, 2, 8376);
    			attr_dev(div11, "class", "modal fade");
    			attr_dev(div11, "id", "approve");
    			attr_dev(div11, "tabindex", "-1");
    			attr_dev(div11, "role", "dialog");
    			attr_dev(div11, "aria-hidden", "true");
    			add_location(div11, file$1, 303, 0, 8271);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h50);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			append_dev(button0, span0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, button1);
    			append_dev(div1, t8);
    			append_dev(div1, button2);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div6);
    			append_dev(div6, h51);
    			append_dev(div6, t12);
    			append_dev(div6, button3);
    			append_dev(button3, span1);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			append_dev(div8, p1);
    			append_dev(div8, t16);
    			append_dev(div8, div7);
    			append_dev(div7, button4);
    			append_dev(div7, t18);
    			append_dev(div7, button5);
    		},
    		p: function update(ctx, dirty) {
    			if (/*success*/ ctx[14]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div11);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let $jwt_token;
    	let $user;
    	let $isAuthenticated;
    	validate_store(jwt_token, 'jwt_token');
    	component_subscribe($$self, jwt_token, $$value => $$invalidate(21, $jwt_token = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(15, $user = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(0, $isAuthenticated = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Firewall_Rule_Details', slots, []);
    	let { params = {} } = $$props;
    	const api_root = window.location.origin + "/api";
    	let id;
    	let firewallRules = [];
    	let firewallType = [];
    	let context = [];
    	let sHo = [];

    	let sHgoWithHo = {
    		hgoId: null,
    		hgoName: null,
    		hgoDescription: null,
    		membersId: [],
    		members: []
    	};

    	let sNo = [];

    	let sNgoWithNo = {
    		ngoId: null,
    		ngoName: null,
    		ngoDescription: null,
    		membersId: [],
    		members: []
    	};

    	let dHo = [];

    	let dHgoWithHo = {
    		hgoId: null,
    		hgoName: null,
    		hgoDescription: null,
    		membersId: [],
    		members: []
    	};

    	let dNo = [];

    	let dNgoWithNo = {
    		ngoId: null,
    		ngoName: null,
    		ngoDescription: null,
    		membersId: [],
    		members: []
    	};

    	let sgo = { id: null, name: null, port: [] };
    	let uc = [];
    	let success = null;
    	let fwStatusToChange = { fwId: null, status: null, userMail: null };

    	function getFirewallRules() {
    		var config = {
    			method: "get",
    			url: api_root + "/service/findFwD/" + id,
    			headers: { Authorization: "Bearer " + $jwt_token }
    		};

    		axios(config).then(function (response) {
    			$$invalidate(1, firewallRules = response.data);
    			$$invalidate(2, firewallType = response.data.fwType);
    			$$invalidate(3, context = response.data.context);
    			$$invalidate(4, sHo = response.data.sHo);
    			$$invalidate(5, sHgoWithHo = response.data.sHgoWithHo);
    			$$invalidate(6, sNo = response.data.sNo);
    			$$invalidate(7, sNgoWithNo = response.data.sNgoWithNo);
    			$$invalidate(8, dHo = response.data.dHo);
    			$$invalidate(9, dHgoWithHo = response.data.dHgoWithHo);
    			$$invalidate(10, dNo = response.data.dNo);
    			$$invalidate(11, dNgoWithNo = response.data.dNgoWithNo);
    			$$invalidate(12, sgo = response.data.sgo);
    			$$invalidate(13, uc = response.data.uc);
    			$$invalidate(14, success = "yes");
    		}).catch(function (error) {
    			console.log(error);
    		});
    	}

    	function changeFwStatusApproved(fw) {
    		fwStatusToChange.fwId = fw.fwId;
    		fwStatusToChange.status = "APPROVED";
    		fwStatusToChange.userMail = fw.userMail;

    		var config = {
    			method: "post",
    			url: api_root + "/service/change-status",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: fwStatusToChange
    		};

    		axios(config).then(function (response) {
    			getFirewallRules();
    		}).catch(function (error) {
    			alert("Could not change Status of Firewall Rule");
    			console.log(error);
    		});
    	}

    	function changeFwStatusRejected(fw) {
    		fwStatusToChange.fwId = fw.fwId;
    		fwStatusToChange.status = "REJECTED";
    		fwStatusToChange.userMail = $user.email;

    		var config = {
    			method: "post",
    			url: api_root + "/service/change-status",
    			headers: {
    				Authorization: "Bearer " + $jwt_token,
    				"Content-Type": "application/json"
    			},
    			data: fwStatusToChange
    		};

    		axios(config).then(function (response) {
    			getFirewallRules();
    		}).catch(function (error) {
    			alert("Could not change Status of Firewall Rule");
    			console.log(error);
    		});
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Firewall_Rule_Details> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(18, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		axios,
    		params,
    		isAuthenticated,
    		user,
    		jwt_token,
    		api_root,
    		id,
    		firewallRules,
    		firewallType,
    		context,
    		sHo,
    		sHgoWithHo,
    		sNo,
    		sNgoWithNo,
    		dHo,
    		dHgoWithHo,
    		dNo,
    		dNgoWithNo,
    		sgo,
    		uc,
    		success,
    		fwStatusToChange,
    		getFirewallRules,
    		changeFwStatusApproved,
    		changeFwStatusRejected,
    		$jwt_token,
    		$user,
    		$isAuthenticated
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(18, params = $$props.params);
    		if ('id' in $$props) id = $$props.id;
    		if ('firewallRules' in $$props) $$invalidate(1, firewallRules = $$props.firewallRules);
    		if ('firewallType' in $$props) $$invalidate(2, firewallType = $$props.firewallType);
    		if ('context' in $$props) $$invalidate(3, context = $$props.context);
    		if ('sHo' in $$props) $$invalidate(4, sHo = $$props.sHo);
    		if ('sHgoWithHo' in $$props) $$invalidate(5, sHgoWithHo = $$props.sHgoWithHo);
    		if ('sNo' in $$props) $$invalidate(6, sNo = $$props.sNo);
    		if ('sNgoWithNo' in $$props) $$invalidate(7, sNgoWithNo = $$props.sNgoWithNo);
    		if ('dHo' in $$props) $$invalidate(8, dHo = $$props.dHo);
    		if ('dHgoWithHo' in $$props) $$invalidate(9, dHgoWithHo = $$props.dHgoWithHo);
    		if ('dNo' in $$props) $$invalidate(10, dNo = $$props.dNo);
    		if ('dNgoWithNo' in $$props) $$invalidate(11, dNgoWithNo = $$props.dNgoWithNo);
    		if ('sgo' in $$props) $$invalidate(12, sgo = $$props.sgo);
    		if ('uc' in $$props) $$invalidate(13, uc = $$props.uc);
    		if ('success' in $$props) $$invalidate(14, success = $$props.success);
    		if ('fwStatusToChange' in $$props) fwStatusToChange = $$props.fwStatusToChange;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$isAuthenticated, params*/ 262145) {
    			{
    				if ($isAuthenticated == true) id = params.id;
    				getFirewallRules();
    			}
    		}
    	};

    	return [
    		$isAuthenticated,
    		firewallRules,
    		firewallType,
    		context,
    		sHo,
    		sHgoWithHo,
    		sNo,
    		sNgoWithNo,
    		dHo,
    		dHgoWithHo,
    		dNo,
    		dNgoWithNo,
    		sgo,
    		uc,
    		success,
    		$user,
    		changeFwStatusApproved,
    		changeFwStatusRejected,
    		params
    	];
    }

    class Firewall_Rule_Details extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { params: 18 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Firewall_Rule_Details",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get params() {
    		throw new Error("<Firewall_Rule_Details>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Firewall_Rule_Details>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var routes = {
        '/': Home,
        '/home': Home,
        '/firewall-Rules': Firewall_Rules,
        '/firewall-Rule-Details/:id': Firewall_Rule_Details,
        '/contexts': Contexts,
        '/network-Objects' : Network_Objects,
        '/network-Group-Objects': Network_Group_Objects,
        '/host-Objects': Host_Objects,
        '/host-Group-Objects': Host_Group_Objects,
        '/service-Group-Objects': Service_Group_Objects,
        '/use-cases': Use_Cases,
        
        
        
    };

    var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);},e(t,n)};function t(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function r(){this.constructor=t;}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}var n=function(){return n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)};function r(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);}return n}function o(e,t,n,r){return new(n||(n=Promise))((function(o,i){function c(e){try{s(r.next(e));}catch(e){i(e);}}function a(e){try{s(r.throw(e));}catch(e){i(e);}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t);}))).then(c,a);}s((r=r.apply(e,t||[])).next());}))}function i(e,t){var n,r,o,i,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,r=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(o=c.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){c=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){c.label=i[1];break}if(6===i[0]&&c.label<o[1]){c.label=o[1],o=i;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(i);break}o[2]&&c.ops.pop(),c.trys.pop();continue}i=t.call(e,c);}catch(e){i=[6,e],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,a])}}}function c(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),c=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)c.push(r.value);}catch(e){o={error:e};}finally{try{r&&!r.done&&(n=i.return)&&n.call(i);}finally{if(o)throw o.error}}return c}function a(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))}var s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function u(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function l(e,t){return e(t={exports:{}},t.exports),t.exports}var f,d,h=function(e){return e&&e.Math==Math&&e},p=h("object"==typeof globalThis&&globalThis)||h("object"==typeof window&&window)||h("object"==typeof self&&self)||h("object"==typeof s&&s)||function(){return this}()||Function("return this")(),y=function(e){try{return !!e()}catch(e){return !0}},v=!y((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),m=!y((function(){var e=function(){}.bind();return "function"!=typeof e||e.hasOwnProperty("prototype")})),b=Function.prototype.call,g=m?b.bind(b):function(){return b.apply(b,arguments)},w={}.propertyIsEnumerable,S=Object.getOwnPropertyDescriptor,k=S&&!w.call({1:2},1)?function(e){var t=S(this,e);return !!t&&t.enumerable}:w,_={f:k},I=function(e,t){return {enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},O=Function.prototype,x=O.bind,T=O.call,C=m&&x.bind(T,T),j=m?function(e){return e&&C(e)}:function(e){return e&&function(){return T.apply(e,arguments)}},R=j({}.toString),L=j("".slice),W=function(e){return L(R(e),8,-1)},Z=Object,E=j("".split),G=y((function(){return !Z("z").propertyIsEnumerable(0)}))?function(e){return "String"==W(e)?E(e,""):Z(e)}:Z,P=function(e){return null==e},A=TypeError,X=function(e){if(P(e))throw A("Can't call method on "+e);return e},F=function(e){return G(X(e))},K=function(e){return "function"==typeof e},N="object"==typeof document&&document.all,U=void 0===N&&void 0!==N?function(e){return "object"==typeof e?null!==e:K(e)||e===N}:function(e){return "object"==typeof e?null!==e:K(e)},H=function(e){return K(e)?e:void 0},D=function(e,t){return arguments.length<2?H(p[e]):p[e]&&p[e][t]},Y=j({}.isPrototypeOf),J=D("navigator","userAgent")||"",V=p.process,z=p.Deno,M=V&&V.versions||z&&z.version,B=M&&M.v8;B&&(d=(f=B.split("."))[0]>0&&f[0]<4?1:+(f[0]+f[1])),!d&&J&&(!(f=J.match(/Edge\/(\d+)/))||f[1]>=74)&&(f=J.match(/Chrome\/(\d+)/))&&(d=+f[1]);var Q=d,q=!!Object.getOwnPropertySymbols&&!y((function(){var e=Symbol();return !String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&Q&&Q<41})),$=q&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,ee=Object,te=$?function(e){return "symbol"==typeof e}:function(e){var t=D("Symbol");return K(t)&&Y(t.prototype,ee(e))},ne=String,re=function(e){try{return ne(e)}catch(e){return "Object"}},oe=TypeError,ie=function(e){if(K(e))return e;throw oe(re(e)+" is not a function")},ce=function(e,t){var n=e[t];return P(n)?void 0:ie(n)},ae=TypeError,se=Object.defineProperty,ue=function(e,t){try{se(p,e,{value:t,configurable:!0,writable:!0});}catch(n){p[e]=t;}return t},le=p["__core-js_shared__"]||ue("__core-js_shared__",{}),fe=l((function(e){(e.exports=function(e,t){return le[e]||(le[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.25.1",mode:"global",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.25.1/LICENSE",source:"https://github.com/zloirock/core-js"});})),de=Object,he=function(e){return de(X(e))},pe=j({}.hasOwnProperty),ye=Object.hasOwn||function(e,t){return pe(he(e),t)},ve=0,me=Math.random(),be=j(1..toString),ge=function(e){return "Symbol("+(void 0===e?"":e)+")_"+be(++ve+me,36)},we=fe("wks"),Se=p.Symbol,ke=Se&&Se.for,_e=$?Se:Se&&Se.withoutSetter||ge,Ie=function(e){if(!ye(we,e)||!q&&"string"!=typeof we[e]){var t="Symbol."+e;q&&ye(Se,e)?we[e]=Se[e]:we[e]=$&&ke?ke(t):_e(t);}return we[e]},Oe=TypeError,xe=Ie("toPrimitive"),Te=function(e,t){if(!U(e)||te(e))return e;var n,r=ce(e,xe);if(r){if(void 0===t&&(t="default"),n=g(r,e,t),!U(n)||te(n))return n;throw Oe("Can't convert object to primitive value")}return void 0===t&&(t="number"),function(e,t){var n,r;if("string"===t&&K(n=e.toString)&&!U(r=g(n,e)))return r;if(K(n=e.valueOf)&&!U(r=g(n,e)))return r;if("string"!==t&&K(n=e.toString)&&!U(r=g(n,e)))return r;throw ae("Can't convert object to primitive value")}(e,t)},Ce=function(e){var t=Te(e,"string");return te(t)?t:t+""},je=p.document,Re=U(je)&&U(je.createElement),Le=function(e){return Re?je.createElement(e):{}},We=!v&&!y((function(){return 7!=Object.defineProperty(Le("div"),"a",{get:function(){return 7}}).a})),Ze=Object.getOwnPropertyDescriptor,Ee={f:v?Ze:function(e,t){if(e=F(e),t=Ce(t),We)try{return Ze(e,t)}catch(e){}if(ye(e,t))return I(!g(_.f,e,t),e[t])}},Ge=v&&y((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype})),Pe=String,Ae=TypeError,Xe=function(e){if(U(e))return e;throw Ae(Pe(e)+" is not an object")},Fe=TypeError,Ke=Object.defineProperty,Ne=Object.getOwnPropertyDescriptor,Ue={f:v?Ge?function(e,t,n){if(Xe(e),t=Ce(t),Xe(n),"function"==typeof e&&"prototype"===t&&"value"in n&&"writable"in n&&!n.writable){var r=Ne(e,t);r&&r.writable&&(e[t]=n.value,n={configurable:"configurable"in n?n.configurable:r.configurable,enumerable:"enumerable"in n?n.enumerable:r.enumerable,writable:!1});}return Ke(e,t,n)}:Ke:function(e,t,n){if(Xe(e),t=Ce(t),Xe(n),We)try{return Ke(e,t,n)}catch(e){}if("get"in n||"set"in n)throw Fe("Accessors not supported");return "value"in n&&(e[t]=n.value),e}},He=v?function(e,t,n){return Ue.f(e,t,I(1,n))}:function(e,t,n){return e[t]=n,e},De=Function.prototype,Ye=v&&Object.getOwnPropertyDescriptor,Je=ye(De,"name"),Ve={EXISTS:Je,PROPER:Je&&"something"===function(){}.name,CONFIGURABLE:Je&&(!v||v&&Ye(De,"name").configurable)},ze=j(Function.toString);K(le.inspectSource)||(le.inspectSource=function(e){return ze(e)});var Me,Be,Qe,qe=le.inspectSource,$e=p.WeakMap,et=K($e)&&/native code/.test(String($e)),tt=fe("keys"),nt=function(e){return tt[e]||(tt[e]=ge(e))},rt={},ot=p.TypeError,it=p.WeakMap;if(et||le.state){var ct=le.state||(le.state=new it),at=j(ct.get),st=j(ct.has),ut=j(ct.set);Me=function(e,t){if(st(ct,e))throw ot("Object already initialized");return t.facade=e,ut(ct,e,t),t},Be=function(e){return at(ct,e)||{}},Qe=function(e){return st(ct,e)};}else {var lt=nt("state");rt[lt]=!0,Me=function(e,t){if(ye(e,lt))throw ot("Object already initialized");return t.facade=e,He(e,lt,t),t},Be=function(e){return ye(e,lt)?e[lt]:{}},Qe=function(e){return ye(e,lt)};}var ft={set:Me,get:Be,has:Qe,enforce:function(e){return Qe(e)?Be(e):Me(e,{})},getterFor:function(e){return function(t){var n;if(!U(t)||(n=Be(t)).type!==e)throw ot("Incompatible receiver, "+e+" required");return n}}},dt=l((function(e){var t=Ve.CONFIGURABLE,n=ft.enforce,r=ft.get,o=Object.defineProperty,i=v&&!y((function(){return 8!==o((function(){}),"length",{value:8}).length})),c=String(String).split("String"),a=e.exports=function(e,r,a){"Symbol("===String(r).slice(0,7)&&(r="["+String(r).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),a&&a.getter&&(r="get "+r),a&&a.setter&&(r="set "+r),(!ye(e,"name")||t&&e.name!==r)&&(v?o(e,"name",{value:r,configurable:!0}):e.name=r),i&&a&&ye(a,"arity")&&e.length!==a.arity&&o(e,"length",{value:a.arity});try{a&&ye(a,"constructor")&&a.constructor?v&&o(e,"prototype",{writable:!1}):e.prototype&&(e.prototype=void 0);}catch(e){}var s=n(e);return ye(s,"source")||(s.source=c.join("string"==typeof r?r:"")),e};Function.prototype.toString=a((function(){return K(this)&&r(this).source||qe(this)}),"toString");})),ht=function(e,t,n,r){r||(r={});var o=r.enumerable,i=void 0!==r.name?r.name:t;if(K(n)&&dt(n,i,r),r.global)o?e[t]=n:ue(t,n);else {try{r.unsafe?e[t]&&(o=!0):delete e[t];}catch(e){}o?e[t]=n:Ue.f(e,t,{value:n,enumerable:!1,configurable:!r.nonConfigurable,writable:!r.nonWritable});}return e},pt=Math.ceil,yt=Math.floor,vt=Math.trunc||function(e){var t=+e;return (t>0?yt:pt)(t)},mt=function(e){var t=+e;return t!=t||0===t?0:vt(t)},bt=Math.max,gt=Math.min,wt=function(e,t){var n=mt(e);return n<0?bt(n+t,0):gt(n,t)},St=Math.min,kt=function(e){return e>0?St(mt(e),9007199254740991):0},_t=function(e){return kt(e.length)},It=function(e){return function(t,n,r){var o,i=F(t),c=_t(i),a=wt(r,c);if(e&&n!=n){for(;c>a;)if((o=i[a++])!=o)return !0}else for(;c>a;a++)if((e||a in i)&&i[a]===n)return e||a||0;return !e&&-1}},Ot={includes:It(!0),indexOf:It(!1)},xt=Ot.indexOf,Tt=j([].push),Ct=function(e,t){var n,r=F(e),o=0,i=[];for(n in r)!ye(rt,n)&&ye(r,n)&&Tt(i,n);for(;t.length>o;)ye(r,n=t[o++])&&(~xt(i,n)||Tt(i,n));return i},jt=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],Rt=jt.concat("length","prototype"),Lt={f:Object.getOwnPropertyNames||function(e){return Ct(e,Rt)}},Wt={f:Object.getOwnPropertySymbols},Zt=j([].concat),Et=D("Reflect","ownKeys")||function(e){var t=Lt.f(Xe(e)),n=Wt.f;return n?Zt(t,n(e)):t},Gt=function(e,t,n){for(var r=Et(t),o=Ue.f,i=Ee.f,c=0;c<r.length;c++){var a=r[c];ye(e,a)||n&&ye(n,a)||o(e,a,i(t,a));}},Pt=/#|\.prototype\./,At=function(e,t){var n=Ft[Xt(e)];return n==Nt||n!=Kt&&(K(t)?y(t):!!t)},Xt=At.normalize=function(e){return String(e).replace(Pt,".").toLowerCase()},Ft=At.data={},Kt=At.NATIVE="N",Nt=At.POLYFILL="P",Ut=At,Ht=Ee.f,Dt=function(e,t){var n,r,o,i,c,a=e.target,s=e.global,u=e.stat;if(n=s?p:u?p[a]||ue(a,{}):(p[a]||{}).prototype)for(r in t){if(i=t[r],o=e.dontCallGetSet?(c=Ht(n,r))&&c.value:n[r],!Ut(s?r:a+(u?".":"#")+r,e.forced)&&void 0!==o){if(typeof i==typeof o)continue;Gt(i,o);}(e.sham||o&&o.sham)&&He(i,"sham",!0),ht(n,r,i,e);}},Yt={};Yt[Ie("toStringTag")]="z";var Jt,Vt="[object z]"===String(Yt),zt=Ie("toStringTag"),Mt=Object,Bt="Arguments"==W(function(){return arguments}()),Qt=Vt?W:function(e){var t,n,r;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(e){}}(t=Mt(e),zt))?n:Bt?W(t):"Object"==(r=W(t))&&K(t.callee)?"Arguments":r},qt=String,$t=function(e){if("Symbol"===Qt(e))throw TypeError("Cannot convert a Symbol value to a string");return qt(e)},en=Ie("match"),tn=TypeError,nn=function(e){if(function(e){var t;return U(e)&&(void 0!==(t=e[en])?!!t:"RegExp"==W(e))}(e))throw tn("The method doesn't accept regular expressions");return e},rn=Ie("match"),on=function(e){var t=/./;try{"/./"[e](t);}catch(n){try{return t[rn]=!1,"/./"[e](t)}catch(e){}}return !1},cn=Ee.f,an=j("".startsWith),sn=j("".slice),un=Math.min,ln=on("startsWith"),fn=!(ln||(Jt=cn(String.prototype,"startsWith"),!Jt||Jt.writable));Dt({target:"String",proto:!0,forced:!fn&&!ln},{startsWith:function(e){var t=$t(X(this));nn(e);var n=kt(un(arguments.length>1?arguments[1]:void 0,t.length)),r=$t(e);return an?an(t,r,n):sn(t,n,n+r.length)===r}});var dn=function(e,t){return j(p[e].prototype[t])};dn("String","startsWith");var hn=Array.isArray||function(e){return "Array"==W(e)},pn=TypeError,yn=function(e){if(e>9007199254740991)throw pn("Maximum allowed index exceeded");return e},vn=function(e,t,n){var r=Ce(t);r in e?Ue.f(e,r,I(0,n)):e[r]=n;},mn=function(){},bn=[],gn=D("Reflect","construct"),wn=/^\s*(?:class|function)\b/,Sn=j(wn.exec),kn=!wn.exec(mn),_n=function(e){if(!K(e))return !1;try{return gn(mn,bn,e),!0}catch(e){return !1}},In=function(e){if(!K(e))return !1;switch(Qt(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return !1}try{return kn||!!Sn(wn,qe(e))}catch(e){return !0}};In.sham=!0;var On,xn=!gn||y((function(){var e;return _n(_n.call)||!_n(Object)||!_n((function(){e=!0;}))||e}))?In:_n,Tn=Ie("species"),Cn=Array,jn=function(e,t){return new(function(e){var t;return hn(e)&&(t=e.constructor,(xn(t)&&(t===Cn||hn(t.prototype))||U(t)&&null===(t=t[Tn]))&&(t=void 0)),void 0===t?Cn:t}(e))(0===t?0:t)},Rn=Ie("species"),Ln=Ie("isConcatSpreadable"),Wn=Q>=51||!y((function(){var e=[];return e[Ln]=!1,e.concat()[0]!==e})),Zn=(On="concat",Q>=51||!y((function(){var e=[];return (e.constructor={})[Rn]=function(){return {foo:1}},1!==e[On](Boolean).foo}))),En=function(e){if(!U(e))return !1;var t=e[Ln];return void 0!==t?!!t:hn(e)};Dt({target:"Array",proto:!0,arity:1,forced:!Wn||!Zn},{concat:function(e){var t,n,r,o,i,c=he(this),a=jn(c,0),s=0;for(t=-1,r=arguments.length;t<r;t++)if(En(i=-1===t?c:arguments[t]))for(o=_t(i),yn(s+o),n=0;n<o;n++,s++)n in i&&vn(a,s,i[n]);else yn(s+1),vn(a,s++,i);return a.length=s,a}});var Gn=Vt?{}.toString:function(){return "[object "+Qt(this)+"]"};Vt||ht(Object.prototype,"toString",Gn,{unsafe:!0});var Pn,An=Object.keys||function(e){return Ct(e,jt)},Xn=v&&!Ge?Object.defineProperties:function(e,t){Xe(e);for(var n,r=F(t),o=An(t),i=o.length,c=0;i>c;)Ue.f(e,n=o[c++],r[n]);return e},Fn={f:Xn},Kn=D("document","documentElement"),Nn=nt("IE_PROTO"),Un=function(){},Hn=function(e){return "<script>"+e+"<\/script>"},Dn=function(e){e.write(Hn("")),e.close();var t=e.parentWindow.Object;return e=null,t},Yn=function(){try{Pn=new ActiveXObject("htmlfile");}catch(e){}var e,t;Yn="undefined"!=typeof document?document.domain&&Pn?Dn(Pn):((t=Le("iframe")).style.display="none",Kn.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(Hn("document.F=Object")),e.close(),e.F):Dn(Pn);for(var n=jt.length;n--;)delete Yn.prototype[jt[n]];return Yn()};rt[Nn]=!0;var Jn=Object.create||function(e,t){var n;return null!==e?(Un.prototype=Xe(e),n=new Un,Un.prototype=null,n[Nn]=e):n=Yn(),void 0===t?n:Fn.f(n,t)},Vn=Array,zn=Math.max,Mn=Lt.f,Bn="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],Qn=function(e){try{return Mn(e)}catch(e){return function(e,t,n){for(var r=_t(e),o=wt(t,r),i=wt(void 0===n?r:n,r),c=Vn(zn(i-o,0)),a=0;o<i;o++,a++)vn(c,a,e[o]);return c.length=a,c}(Bn)}},qn={f:function(e){return Bn&&"Window"==W(e)?Qn(e):Mn(F(e))}},$n={f:Ie},er=p,tr=Ue.f,nr=function(e){var t=er.Symbol||(er.Symbol={});ye(t,e)||tr(t,e,{value:$n.f(e)});},rr=function(){var e=D("Symbol"),t=e&&e.prototype,n=t&&t.valueOf,r=Ie("toPrimitive");t&&!t[r]&&ht(t,r,(function(e){return g(n,this)}),{arity:1});},or=Ue.f,ir=Ie("toStringTag"),cr=function(e,t,n){e&&!n&&(e=e.prototype),e&&!ye(e,ir)&&or(e,ir,{configurable:!0,value:t});},ar=j(j.bind),sr=function(e,t){return ie(e),void 0===t?e:m?ar(e,t):function(){return e.apply(t,arguments)}},ur=j([].push),lr=function(e){var t=1==e,n=2==e,r=3==e,o=4==e,i=6==e,c=7==e,a=5==e||i;return function(s,u,l,f){for(var d,h,p=he(s),y=G(p),v=sr(u,l),m=_t(y),b=0,g=f||jn,w=t?g(s,m):n||c?g(s,0):void 0;m>b;b++)if((a||b in y)&&(h=v(d=y[b],b,p),e))if(t)w[b]=h;else if(h)switch(e){case 3:return !0;case 5:return d;case 6:return b;case 2:ur(w,d);}else switch(e){case 4:return !1;case 7:ur(w,d);}return i?-1:r||o?o:w}},fr={forEach:lr(0),map:lr(1),filter:lr(2),some:lr(3),every:lr(4),find:lr(5),findIndex:lr(6),filterReject:lr(7)}.forEach,dr=nt("hidden"),hr=ft.set,pr=ft.getterFor("Symbol"),yr=Object.prototype,vr=p.Symbol,mr=vr&&vr.prototype,br=p.TypeError,gr=p.QObject,wr=Ee.f,Sr=Ue.f,kr=qn.f,_r=_.f,Ir=j([].push),Or=fe("symbols"),xr=fe("op-symbols"),Tr=fe("wks"),Cr=!gr||!gr.prototype||!gr.prototype.findChild,jr=v&&y((function(){return 7!=Jn(Sr({},"a",{get:function(){return Sr(this,"a",{value:7}).a}})).a}))?function(e,t,n){var r=wr(yr,t);r&&delete yr[t],Sr(e,t,n),r&&e!==yr&&Sr(yr,t,r);}:Sr,Rr=function(e,t){var n=Or[e]=Jn(mr);return hr(n,{type:"Symbol",tag:e,description:t}),v||(n.description=t),n},Lr=function(e,t,n){e===yr&&Lr(xr,t,n),Xe(e);var r=Ce(t);return Xe(n),ye(Or,r)?(n.enumerable?(ye(e,dr)&&e[dr][r]&&(e[dr][r]=!1),n=Jn(n,{enumerable:I(0,!1)})):(ye(e,dr)||Sr(e,dr,I(1,{})),e[dr][r]=!0),jr(e,r,n)):Sr(e,r,n)},Wr=function(e,t){Xe(e);var n=F(t),r=An(n).concat(Pr(n));return fr(r,(function(t){v&&!g(Zr,n,t)||Lr(e,t,n[t]);})),e},Zr=function(e){var t=Ce(e),n=g(_r,this,t);return !(this===yr&&ye(Or,t)&&!ye(xr,t))&&(!(n||!ye(this,t)||!ye(Or,t)||ye(this,dr)&&this[dr][t])||n)},Er=function(e,t){var n=F(e),r=Ce(t);if(n!==yr||!ye(Or,r)||ye(xr,r)){var o=wr(n,r);return !o||!ye(Or,r)||ye(n,dr)&&n[dr][r]||(o.enumerable=!0),o}},Gr=function(e){var t=kr(F(e)),n=[];return fr(t,(function(e){ye(Or,e)||ye(rt,e)||Ir(n,e);})),n},Pr=function(e){var t=e===yr,n=kr(t?xr:F(e)),r=[];return fr(n,(function(e){!ye(Or,e)||t&&!ye(yr,e)||Ir(r,Or[e]);})),r};q||(mr=(vr=function(){if(Y(mr,this))throw br("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?$t(arguments[0]):void 0,t=ge(e),n=function(e){this===yr&&g(n,xr,e),ye(this,dr)&&ye(this[dr],t)&&(this[dr][t]=!1),jr(this,t,I(1,e));};return v&&Cr&&jr(yr,t,{configurable:!0,set:n}),Rr(t,e)}).prototype,ht(mr,"toString",(function(){return pr(this).tag})),ht(vr,"withoutSetter",(function(e){return Rr(ge(e),e)})),_.f=Zr,Ue.f=Lr,Fn.f=Wr,Ee.f=Er,Lt.f=qn.f=Gr,Wt.f=Pr,$n.f=function(e){return Rr(Ie(e),e)},v&&(Sr(mr,"description",{configurable:!0,get:function(){return pr(this).description}}),ht(yr,"propertyIsEnumerable",Zr,{unsafe:!0}))),Dt({global:!0,constructor:!0,wrap:!0,forced:!q,sham:!q},{Symbol:vr}),fr(An(Tr),(function(e){nr(e);})),Dt({target:"Symbol",stat:!0,forced:!q},{useSetter:function(){Cr=!0;},useSimple:function(){Cr=!1;}}),Dt({target:"Object",stat:!0,forced:!q,sham:!v},{create:function(e,t){return void 0===t?Jn(e):Wr(Jn(e),t)},defineProperty:Lr,defineProperties:Wr,getOwnPropertyDescriptor:Er}),Dt({target:"Object",stat:!0,forced:!q},{getOwnPropertyNames:Gr}),rr(),cr(vr,"Symbol"),rt[dr]=!0;var Ar=q&&!!Symbol.for&&!!Symbol.keyFor,Xr=fe("string-to-symbol-registry"),Fr=fe("symbol-to-string-registry");Dt({target:"Symbol",stat:!0,forced:!Ar},{for:function(e){var t=$t(e);if(ye(Xr,t))return Xr[t];var n=D("Symbol")(t);return Xr[t]=n,Fr[n]=t,n}});var Kr=fe("symbol-to-string-registry");Dt({target:"Symbol",stat:!0,forced:!Ar},{keyFor:function(e){if(!te(e))throw TypeError(re(e)+" is not a symbol");if(ye(Kr,e))return Kr[e]}});var Nr=Function.prototype,Ur=Nr.apply,Hr=Nr.call,Dr="object"==typeof Reflect&&Reflect.apply||(m?Hr.bind(Ur):function(){return Hr.apply(Ur,arguments)}),Yr=j([].slice),Jr=D("JSON","stringify"),Vr=j(/./.exec),zr=j("".charAt),Mr=j("".charCodeAt),Br=j("".replace),Qr=j(1..toString),qr=/[\uD800-\uDFFF]/g,$r=/^[\uD800-\uDBFF]$/,eo=/^[\uDC00-\uDFFF]$/,to=!q||y((function(){var e=D("Symbol")();return "[null]"!=Jr([e])||"{}"!=Jr({a:e})||"{}"!=Jr(Object(e))})),no=y((function(){return '"\\udf06\\ud834"'!==Jr("\udf06\ud834")||'"\\udead"'!==Jr("\udead")})),ro=function(e,t){var n=Yr(arguments),r=t;if((U(t)||void 0!==e)&&!te(e))return hn(t)||(t=function(e,t){if(K(r)&&(t=g(r,this,e,t)),!te(t))return t}),n[1]=t,Dr(Jr,null,n)},oo=function(e,t,n){var r=zr(n,t-1),o=zr(n,t+1);return Vr($r,e)&&!Vr(eo,o)||Vr(eo,e)&&!Vr($r,r)?"\\u"+Qr(Mr(e,0),16):e};Jr&&Dt({target:"JSON",stat:!0,arity:3,forced:to||no},{stringify:function(e,t,n){var r=Yr(arguments),o=Dr(to?ro:Jr,null,r);return no&&"string"==typeof o?Br(o,qr,oo):o}});var io=!q||y((function(){Wt.f(1);}));Dt({target:"Object",stat:!0,forced:io},{getOwnPropertySymbols:function(e){var t=Wt.f;return t?t(he(e)):[]}}),nr("asyncIterator");var co=Ue.f,ao=p.Symbol,so=ao&&ao.prototype;if(v&&K(ao)&&(!("description"in so)||void 0!==ao().description)){var uo={},lo=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:$t(arguments[0]),t=Y(so,this)?new ao(e):void 0===e?ao():ao(e);return ""===e&&(uo[t]=!0),t};Gt(lo,ao),lo.prototype=so,so.constructor=lo;var fo="Symbol(test)"==String(ao("test")),ho=j(so.valueOf),po=j(so.toString),yo=/^Symbol\((.*)\)[^)]+$/,vo=j("".replace),mo=j("".slice);co(so,"description",{configurable:!0,get:function(){var e=ho(this);if(ye(uo,e))return "";var t=po(e),n=fo?mo(t,7,-1):vo(t,yo,"$1");return ""===n?void 0:n}}),Dt({global:!0,constructor:!0,forced:!0},{Symbol:lo});}nr("hasInstance"),nr("isConcatSpreadable"),nr("iterator"),nr("match"),nr("matchAll"),nr("replace"),nr("search"),nr("species"),nr("split"),nr("toPrimitive"),rr(),nr("toStringTag"),cr(D("Symbol"),"Symbol"),nr("unscopables"),cr(p.JSON,"JSON",!0),cr(Math,"Math",!0),Dt({global:!0},{Reflect:{}}),cr(p.Reflect,"Reflect",!0),er.Symbol;var bo,go,wo,So=j("".charAt),ko=j("".charCodeAt),_o=j("".slice),Io=function(e){return function(t,n){var r,o,i=$t(X(t)),c=mt(n),a=i.length;return c<0||c>=a?e?"":void 0:(r=ko(i,c))<55296||r>56319||c+1===a||(o=ko(i,c+1))<56320||o>57343?e?So(i,c):r:e?_o(i,c,c+2):o-56320+(r-55296<<10)+65536}},Oo={codeAt:Io(!1),charAt:Io(!0)},xo=!y((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})),To=nt("IE_PROTO"),Co=Object,jo=Co.prototype,Ro=xo?Co.getPrototypeOf:function(e){var t=he(e);if(ye(t,To))return t[To];var n=t.constructor;return K(n)&&t instanceof n?n.prototype:t instanceof Co?jo:null},Lo=Ie("iterator"),Wo=!1;[].keys&&("next"in(wo=[].keys())?(go=Ro(Ro(wo)))!==Object.prototype&&(bo=go):Wo=!0);var Zo=!U(bo)||y((function(){var e={};return bo[Lo].call(e)!==e}));Zo&&(bo={}),K(bo[Lo])||ht(bo,Lo,(function(){return this}));var Eo={IteratorPrototype:bo,BUGGY_SAFARI_ITERATORS:Wo},Go={},Po=Eo.IteratorPrototype,Ao=function(){return this},Xo=String,Fo=TypeError,Ko=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,n={};try{(e=j(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(n,[]),t=n instanceof Array;}catch(e){}return function(n,r){return Xe(n),function(e){if("object"==typeof e||K(e))return e;throw Fo("Can't set "+Xo(e)+" as a prototype")}(r),t?e(n,r):n.__proto__=r,n}}():void 0),No=Ve.PROPER,Uo=Ve.CONFIGURABLE,Ho=Eo.IteratorPrototype,Do=Eo.BUGGY_SAFARI_ITERATORS,Yo=Ie("iterator"),Jo=function(){return this},Vo=function(e,t,n,r,o,i,c){!function(e,t,n,r){var o=t+" Iterator";e.prototype=Jn(Po,{next:I(+!r,n)}),cr(e,o,!1),Go[o]=Ao;}(n,t,r);var a,s,u,l=function(e){if(e===o&&y)return y;if(!Do&&e in h)return h[e];switch(e){case"keys":case"values":case"entries":return function(){return new n(this,e)}}return function(){return new n(this)}},f=t+" Iterator",d=!1,h=e.prototype,p=h[Yo]||h["@@iterator"]||o&&h[o],y=!Do&&p||l(o),v="Array"==t&&h.entries||p;if(v&&(a=Ro(v.call(new e)))!==Object.prototype&&a.next&&(Ro(a)!==Ho&&(Ko?Ko(a,Ho):K(a[Yo])||ht(a,Yo,Jo)),cr(a,f,!0)),No&&"values"==o&&p&&"values"!==p.name&&(Uo?He(h,"name","values"):(d=!0,y=function(){return g(p,this)})),o)if(s={values:l("values"),keys:i?y:l("keys"),entries:l("entries")},c)for(u in s)(Do||d||!(u in h))&&ht(h,u,s[u]);else Dt({target:t,proto:!0,forced:Do||d},s);return h[Yo]!==y&&ht(h,Yo,y,{name:o}),Go[t]=y,s},zo=function(e,t){return {value:e,done:t}},Mo=Oo.charAt,Bo=ft.set,Qo=ft.getterFor("String Iterator");Vo(String,"String",(function(e){Bo(this,{type:"String Iterator",string:$t(e),index:0});}),(function(){var e,t=Qo(this),n=t.string,r=t.index;return r>=n.length?zo(void 0,!0):(e=Mo(n,r),t.index+=e.length,zo(e,!1))}));var qo=function(e,t,n){var r,o;Xe(e);try{if(!(r=ce(e,"return"))){if("throw"===t)throw n;return n}r=g(r,e);}catch(e){o=!0,r=e;}if("throw"===t)throw n;if(o)throw r;return Xe(r),n},$o=function(e,t,n,r){try{return r?t(Xe(n)[0],n[1]):t(n)}catch(t){qo(e,"throw",t);}},ei=Ie("iterator"),ti=Array.prototype,ni=function(e){return void 0!==e&&(Go.Array===e||ti[ei]===e)},ri=Ie("iterator"),oi=function(e){if(!P(e))return ce(e,ri)||ce(e,"@@iterator")||Go[Qt(e)]},ii=TypeError,ci=function(e,t){var n=arguments.length<2?oi(e):t;if(ie(n))return Xe(g(n,e));throw ii(re(e)+" is not iterable")},ai=Array,si=Ie("iterator"),ui=!1;try{var li=0,fi={next:function(){return {done:!!li++}},return:function(){ui=!0;}};fi[si]=function(){return this},Array.from(fi,(function(){throw 2}));}catch(e){}var di=function(e,t){if(!t&&!ui)return !1;var n=!1;try{var r={};r[si]=function(){return {next:function(){return {done:n=!0}}}},e(r);}catch(e){}return n},hi=!di((function(e){Array.from(e);}));Dt({target:"Array",stat:!0,forced:hi},{from:function(e){var t=he(e),n=xn(this),r=arguments.length,o=r>1?arguments[1]:void 0,i=void 0!==o;i&&(o=sr(o,r>2?arguments[2]:void 0));var c,a,s,u,l,f,d=oi(t),h=0;if(!d||this===ai&&ni(d))for(c=_t(t),a=n?new this(c):ai(c);c>h;h++)f=i?o(t[h],h):t[h],vn(a,h,f);else for(l=(u=ci(t,d)).next,a=n?new this:[];!(s=g(l,u)).done;h++)f=i?$o(u,o,[s.value,h],!0):s.value,vn(a,h,f);return a.length=h,a}}),er.Array.from;var pi,yi,vi,mi="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof DataView,bi=Ue.f,gi=ft.enforce,wi=ft.get,Si=p.Int8Array,ki=Si&&Si.prototype,_i=p.Uint8ClampedArray,Ii=_i&&_i.prototype,Oi=Si&&Ro(Si),xi=ki&&Ro(ki),Ti=Object.prototype,Ci=p.TypeError,ji=Ie("toStringTag"),Ri=ge("TYPED_ARRAY_TAG"),Li=mi&&!!Ko&&"Opera"!==Qt(p.opera),Wi=!1,Zi={Int8Array:1,Uint8Array:1,Uint8ClampedArray:1,Int16Array:2,Uint16Array:2,Int32Array:4,Uint32Array:4,Float32Array:4,Float64Array:8},Ei={BigInt64Array:8,BigUint64Array:8},Gi=function(e){var t=Ro(e);if(U(t)){var n=wi(t);return n&&ye(n,"TypedArrayConstructor")?n.TypedArrayConstructor:Gi(t)}},Pi=function(e){if(!U(e))return !1;var t=Qt(e);return ye(Zi,t)||ye(Ei,t)};for(pi in Zi)(vi=(yi=p[pi])&&yi.prototype)?gi(vi).TypedArrayConstructor=yi:Li=!1;for(pi in Ei)(vi=(yi=p[pi])&&yi.prototype)&&(gi(vi).TypedArrayConstructor=yi);if((!Li||!K(Oi)||Oi===Function.prototype)&&(Oi=function(){throw Ci("Incorrect invocation")},Li))for(pi in Zi)p[pi]&&Ko(p[pi],Oi);if((!Li||!xi||xi===Ti)&&(xi=Oi.prototype,Li))for(pi in Zi)p[pi]&&Ko(p[pi].prototype,xi);if(Li&&Ro(Ii)!==xi&&Ko(Ii,xi),v&&!ye(xi,ji))for(pi in Wi=!0,bi(xi,ji,{get:function(){return U(this)?this[Ri]:void 0}}),Zi)p[pi]&&He(p[pi],Ri,pi);var Ai={NATIVE_ARRAY_BUFFER_VIEWS:Li,TYPED_ARRAY_TAG:Wi&&Ri,aTypedArray:function(e){if(Pi(e))return e;throw Ci("Target is not a typed array")},aTypedArrayConstructor:function(e){if(K(e)&&(!Ko||Y(Oi,e)))return e;throw Ci(re(e)+" is not a typed array constructor")},exportTypedArrayMethod:function(e,t,n,r){if(v){if(n)for(var o in Zi){var i=p[o];if(i&&ye(i.prototype,e))try{delete i.prototype[e];}catch(n){try{i.prototype[e]=t;}catch(e){}}}xi[e]&&!n||ht(xi,e,n?t:Li&&ki[e]||t,r);}},exportTypedArrayStaticMethod:function(e,t,n){var r,o;if(v){if(Ko){if(n)for(r in Zi)if((o=p[r])&&ye(o,e))try{delete o[e];}catch(e){}if(Oi[e]&&!n)return;try{return ht(Oi,e,n?t:Li&&Oi[e]||t)}catch(e){}}for(r in Zi)!(o=p[r])||o[e]&&!n||ht(o,e,t);}},getTypedArrayConstructor:Gi,isView:function(e){if(!U(e))return !1;var t=Qt(e);return "DataView"===t||ye(Zi,t)||ye(Ei,t)},isTypedArray:Pi,TypedArray:Oi,TypedArrayPrototype:xi},Xi=TypeError,Fi=Ie("species"),Ki=function(e,t){var n,r=Xe(e).constructor;return void 0===r||P(n=Xe(r)[Fi])?t:function(e){if(xn(e))return e;throw Xi(re(e)+" is not a constructor")}(n)},Ni=Ai.aTypedArrayConstructor,Ui=Ai.getTypedArrayConstructor,Hi=Ai.aTypedArray;(0, Ai.exportTypedArrayMethod)("slice",(function(e,t){for(var n,r=Yr(Hi(this),e,t),o=Ni(Ki(n=this,Ui(n))),i=0,c=r.length,a=new o(c);c>i;)a[i]=r[i++];return a}),y((function(){new Int8Array(1).slice();})));var Di=Ue.f,Yi=Ie("unscopables"),Ji=Array.prototype;null==Ji[Yi]&&Di(Ji,Yi,{configurable:!0,value:Jn(null)});var Vi=function(e){Ji[Yi][e]=!0;},zi=Ot.includes,Mi=y((function(){return !Array(1).includes()}));Dt({target:"Array",proto:!0,forced:Mi},{includes:function(e){return zi(this,e,arguments.length>1?arguments[1]:void 0)}}),Vi("includes"),dn("Array","includes");var Bi=j("".indexOf);Dt({target:"String",proto:!0,forced:!on("includes")},{includes:function(e){return !!~Bi($t(X(this)),$t(nn(e)),arguments.length>1?arguments[1]:void 0)}}),dn("String","includes");var Qi=Ue.f,qi=ft.set,$i=ft.getterFor("Array Iterator");Vo(Array,"Array",(function(e,t){qi(this,{type:"Array Iterator",target:F(e),index:0,kind:t});}),(function(){var e=$i(this),t=e.target,n=e.kind,r=e.index++;return !t||r>=t.length?(e.target=void 0,zo(void 0,!0)):zo("keys"==n?r:"values"==n?t[r]:[r,t[r]],!1)}),"values");var ec=Go.Arguments=Go.Array;if(Vi("keys"),Vi("values"),Vi("entries"),v&&"values"!==ec.name)try{Qi(ec,"name",{value:"values"});}catch(e){}var tc=y((function(){if("function"==typeof ArrayBuffer){var e=new ArrayBuffer(8);Object.isExtensible(e)&&Object.defineProperty(e,"a",{value:8});}})),nc=Object.isExtensible,rc=y((function(){nc(1);}))||tc?function(e){return !!U(e)&&((!tc||"ArrayBuffer"!=W(e))&&(!nc||nc(e)))}:nc,oc=!y((function(){return Object.isExtensible(Object.preventExtensions({}))})),ic=l((function(e){var t=Ue.f,n=!1,r=ge("meta"),o=0,i=function(e){t(e,r,{value:{objectID:"O"+o++,weakData:{}}});},c=e.exports={enable:function(){c.enable=function(){},n=!0;var e=Lt.f,t=j([].splice),o={};o[r]=1,e(o).length&&(Lt.f=function(n){for(var o=e(n),i=0,c=o.length;i<c;i++)if(o[i]===r){t(o,i,1);break}return o},Dt({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:qn.f}));},fastKey:function(e,t){if(!U(e))return "symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!ye(e,r)){if(!rc(e))return "F";if(!t)return "E";i(e);}return e[r].objectID},getWeakData:function(e,t){if(!ye(e,r)){if(!rc(e))return !0;if(!t)return !1;i(e);}return e[r].weakData},onFreeze:function(e){return oc&&n&&rc(e)&&!ye(e,r)&&i(e),e}};rt[r]=!0;}));ic.enable,ic.fastKey,ic.getWeakData,ic.onFreeze;var cc=TypeError,ac=function(e,t){this.stopped=e,this.result=t;},sc=ac.prototype,uc=function(e,t,n){var r,o,i,c,a,s,u,l=n&&n.that,f=!(!n||!n.AS_ENTRIES),d=!(!n||!n.IS_RECORD),h=!(!n||!n.IS_ITERATOR),p=!(!n||!n.INTERRUPTED),y=sr(t,l),v=function(e){return r&&qo(r,"normal",e),new ac(!0,e)},m=function(e){return f?(Xe(e),p?y(e[0],e[1],v):y(e[0],e[1])):p?y(e,v):y(e)};if(d)r=e.iterator;else if(h)r=e;else {if(!(o=oi(e)))throw cc(re(e)+" is not iterable");if(ni(o)){for(i=0,c=_t(e);c>i;i++)if((a=m(e[i]))&&Y(sc,a))return a;return new ac(!1)}r=ci(e,o);}for(s=d?e.next:r.next;!(u=g(s,r)).done;){try{a=m(u.value);}catch(e){qo(r,"throw",e);}if("object"==typeof a&&a&&Y(sc,a))return a}return new ac(!1)},lc=TypeError,fc=function(e,t){if(Y(t,e))return e;throw lc("Incorrect invocation")},dc=function(e,t,n){for(var r in t)ht(e,r,t[r],n);return e},hc=Ie("species"),pc=Ue.f,yc=ic.fastKey,vc=ft.set,mc=ft.getterFor,bc={getConstructor:function(e,t,n,r){var o=e((function(e,o){fc(e,i),vc(e,{type:t,index:Jn(null),first:void 0,last:void 0,size:0}),v||(e.size=0),P(o)||uc(o,e[r],{that:e,AS_ENTRIES:n});})),i=o.prototype,c=mc(t),a=function(e,t,n){var r,o,i=c(e),a=s(e,t);return a?a.value=n:(i.last=a={index:o=yc(t,!0),key:t,value:n,previous:r=i.last,next:void 0,removed:!1},i.first||(i.first=a),r&&(r.next=a),v?i.size++:e.size++,"F"!==o&&(i.index[o]=a)),e},s=function(e,t){var n,r=c(e),o=yc(t);if("F"!==o)return r.index[o];for(n=r.first;n;n=n.next)if(n.key==t)return n};return dc(i,{clear:function(){for(var e=c(this),t=e.index,n=e.first;n;)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete t[n.index],n=n.next;e.first=e.last=void 0,v?e.size=0:this.size=0;},delete:function(e){var t=this,n=c(t),r=s(t,e);if(r){var o=r.next,i=r.previous;delete n.index[r.index],r.removed=!0,i&&(i.next=o),o&&(o.previous=i),n.first==r&&(n.first=o),n.last==r&&(n.last=i),v?n.size--:t.size--;}return !!r},forEach:function(e){for(var t,n=c(this),r=sr(e,arguments.length>1?arguments[1]:void 0);t=t?t.next:n.first;)for(r(t.value,t.key,this);t&&t.removed;)t=t.previous;},has:function(e){return !!s(this,e)}}),dc(i,n?{get:function(e){var t=s(this,e);return t&&t.value},set:function(e,t){return a(this,0===e?0:e,t)}}:{add:function(e){return a(this,e=0===e?0:e,e)}}),v&&pc(i,"size",{get:function(){return c(this).size}}),o},setStrong:function(e,t,n){var r=t+" Iterator",o=mc(t),i=mc(r);Vo(e,t,(function(e,t){vc(this,{type:r,target:e,state:o(e),kind:t,last:void 0});}),(function(){for(var e=i(this),t=e.kind,n=e.last;n&&n.removed;)n=n.previous;return e.target&&(e.last=n=n?n.next:e.state.first)?zo("keys"==t?n.key:"values"==t?n.value:[n.key,n.value],!1):(e.target=void 0,zo(void 0,!0))}),n?"entries":"values",!n,!0),function(e){var t=D(e),n=Ue.f;v&&t&&!t[hc]&&n(t,hc,{configurable:!0,get:function(){return this}});}(t);}};function gc(e){var t=this.constructor;return this.then((function(n){return t.resolve(e()).then((function(){return n}))}),(function(n){return t.resolve(e()).then((function(){return t.reject(n)}))}))}function wc(e){return new this((function(t,n){if(!e||void 0===e.length)return n(new TypeError(typeof e+" "+e+" is not iterable(cannot read property Symbol(Symbol.iterator))"));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);var o=r.length;function i(e,n){if(n&&("object"==typeof n||"function"==typeof n)){var c=n.then;if("function"==typeof c)return void c.call(n,(function(t){i(e,t);}),(function(n){r[e]={status:"rejected",reason:n},0==--o&&t(r);}))}r[e]={status:"fulfilled",value:n},0==--o&&t(r);}for(var c=0;c<r.length;c++)i(c,r[c]);}))}!function(e,t,n){var r=-1!==e.indexOf("Map"),o=-1!==e.indexOf("Weak"),i=r?"set":"add",c=p[e],a=c&&c.prototype,s=c,u={},l=function(e){var t=j(a[e]);ht(a,e,"add"==e?function(e){return t(this,0===e?0:e),this}:"delete"==e?function(e){return !(o&&!U(e))&&t(this,0===e?0:e)}:"get"==e?function(e){return o&&!U(e)?void 0:t(this,0===e?0:e)}:"has"==e?function(e){return !(o&&!U(e))&&t(this,0===e?0:e)}:function(e,n){return t(this,0===e?0:e,n),this});};if(Ut(e,!K(c)||!(o||a.forEach&&!y((function(){(new c).entries().next();})))))s=n.getConstructor(t,e,r,i),ic.enable();else if(Ut(e,!0)){var f=new s,d=f[i](o?{}:-0,1)!=f,h=y((function(){f.has(1);})),v=di((function(e){new c(e);})),m=!o&&y((function(){for(var e=new c,t=5;t--;)e[i](t,t);return !e.has(-0)}));v||((s=t((function(e,t){fc(e,a);var n=function(e,t,n){var r,o;return Ko&&K(r=t.constructor)&&r!==n&&U(o=r.prototype)&&o!==n.prototype&&Ko(e,o),e}(new c,e,s);return P(t)||uc(t,n[i],{that:n,AS_ENTRIES:r}),n}))).prototype=a,a.constructor=s),(h||m)&&(l("delete"),l("has"),r&&l("get")),(m||d)&&l(i),o&&a.clear&&delete a.clear;}u[e]=s,Dt({global:!0,constructor:!0,forced:s!=c},u),cr(s,e),o||n.setStrong(s,e,r);}("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),bc),er.Set;var Sc=setTimeout;function kc(e){return Boolean(e&&void 0!==e.length)}function _c(){}function Ic(e){if(!(this instanceof Ic))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],Rc(e,this);}function Oc(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,Ic._immediateFn((function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var r;try{r=n(e._value);}catch(e){return void Tc(t.promise,e)}xc(t.promise,r);}else (1===e._state?xc:Tc)(t.promise,e._value);}))):e._deferreds.push(t);}function xc(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof Ic)return e._state=3,e._value=t,void Cc(e);if("function"==typeof n)return void Rc((r=n,o=t,function(){r.apply(o,arguments);}),e)}e._state=1,e._value=t,Cc(e);}catch(t){Tc(e,t);}var r,o;}function Tc(e,t){e._state=2,e._value=t,Cc(e);}function Cc(e){2===e._state&&0===e._deferreds.length&&Ic._immediateFn((function(){e._handled||Ic._unhandledRejectionFn(e._value);}));for(var t=0,n=e._deferreds.length;t<n;t++)Oc(e,e._deferreds[t]);e._deferreds=null;}function jc(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n;}function Rc(e,t){var n=!1;try{e((function(e){n||(n=!0,xc(t,e));}),(function(e){n||(n=!0,Tc(t,e));}));}catch(e){if(n)return;n=!0,Tc(t,e);}}Ic.prototype.catch=function(e){return this.then(null,e)},Ic.prototype.then=function(e,t){var n=new this.constructor(_c);return Oc(this,new jc(e,t,n)),n},Ic.prototype.finally=gc,Ic.all=function(e){return new Ic((function(t,n){if(!kc(e))return n(new TypeError("Promise.all accepts an array"));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);var o=r.length;function i(e,c){try{if(c&&("object"==typeof c||"function"==typeof c)){var a=c.then;if("function"==typeof a)return void a.call(c,(function(t){i(e,t);}),n)}r[e]=c,0==--o&&t(r);}catch(e){n(e);}}for(var c=0;c<r.length;c++)i(c,r[c]);}))},Ic.allSettled=wc,Ic.resolve=function(e){return e&&"object"==typeof e&&e.constructor===Ic?e:new Ic((function(t){t(e);}))},Ic.reject=function(e){return new Ic((function(t,n){n(e);}))},Ic.race=function(e){return new Ic((function(t,n){if(!kc(e))return n(new TypeError("Promise.race accepts an array"));for(var r=0,o=e.length;r<o;r++)Ic.resolve(e[r]).then(t,n);}))},Ic._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e);}||function(e){Sc(e,0);},Ic._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e);};var Lc=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("unable to locate global object")}();"function"!=typeof Lc.Promise?Lc.Promise=Ic:(Lc.Promise.prototype.finally||(Lc.Promise.prototype.finally=gc),Lc.Promise.allSettled||(Lc.Promise.allSettled=wc)),function(e){function t(e){for(var t=0,n=Math.min(65536,e.length+1),r=new Uint16Array(n),o=[],i=0;;){var c=t<e.length;if(!c||i>=n-1){var a=r.subarray(0,i);if(o.push(String.fromCharCode.apply(null,a)),!c)return o.join("");e=e.subarray(t),t=0,i=0;}var s=e[t++];if(0==(128&s))r[i++]=s;else if(192==(224&s)){var u=63&e[t++];r[i++]=(31&s)<<6|u;}else if(224==(240&s)){u=63&e[t++];var l=63&e[t++];r[i++]=(31&s)<<12|u<<6|l;}else if(240==(248&s)){var f=(7&s)<<18|(u=63&e[t++])<<12|(l=63&e[t++])<<6|63&e[t++];f>65535&&(f-=65536,r[i++]=f>>>10&1023|55296,f=56320|1023&f),r[i++]=f;}}}var n="Failed to ",r=function(e,t,r){if(e)throw new Error("".concat(n).concat(t,": the '").concat(r,"' option is unsupported."))},o="function"==typeof Buffer&&Buffer.from,i=o?function(e){return Buffer.from(e)}:function(e){for(var t=0,n=e.length,r=0,o=Math.max(32,n+(n>>>1)+7),i=new Uint8Array(o>>>3<<3);t<n;){var c=e.charCodeAt(t++);if(c>=55296&&c<=56319){if(t<n){var a=e.charCodeAt(t);56320==(64512&a)&&(++t,c=((1023&c)<<10)+(1023&a)+65536);}if(c>=55296&&c<=56319)continue}if(r+4>i.length){o+=8,o=(o*=1+t/e.length*2)>>>3<<3;var s=new Uint8Array(o);s.set(i),i=s;}if(0!=(4294967168&c)){if(0==(4294965248&c))i[r++]=c>>>6&31|192;else if(0==(4294901760&c))i[r++]=c>>>12&15|224,i[r++]=c>>>6&63|128;else {if(0!=(4292870144&c))continue;i[r++]=c>>>18&7|240,i[r++]=c>>>12&63|128,i[r++]=c>>>6&63|128;}i[r++]=63&c|128;}else i[r++]=c;}return i.slice?i.slice(0,r):i.subarray(0,r)};function c(){this.encoding="utf-8";}c.prototype.encode=function(e,t){return r(t&&t.stream,"encode","stream"),i(e)};var a=!o&&"function"==typeof Blob&&"function"==typeof URL&&"function"==typeof URL.createObjectURL,s=["utf-8","utf8","unicode-1-1-utf-8"],u=t;o?u=function(e,t){return (e instanceof Buffer?e:Buffer.from(e.buffer,e.byteOffset,e.byteLength)).toString(t)}:a&&(u=function(e){try{return function(e){var t;try{var n=new Blob([e],{type:"text/plain;charset=UTF-8"});t=URL.createObjectURL(n);var r=new XMLHttpRequest;return r.open("GET",t,!1),r.send(),r.responseText}finally{t&&URL.revokeObjectURL(t);}}(e)}catch(n){return t(e)}});var l="construct 'TextDecoder'",f="".concat(n," ").concat(l,": the ");function d(e,t){if(r(t&&t.fatal,l,"fatal"),e=e||"utf-8",!(o?Buffer.isEncoding(e):-1!==s.indexOf(e.toLowerCase())))throw new RangeError("".concat(f," encoding label provided ('").concat(e,"') is invalid."));this.encoding=e,this.fatal=!1,this.ignoreBOM=!1;}d.prototype.decode=function(e,t){var n;return r(t&&t.stream,"decode","stream"),n=e instanceof Uint8Array?e:e.buffer instanceof ArrayBuffer?new Uint8Array(e.buffer):new Uint8Array(e),u(n,this.encoding)},e.TextEncoder=e.TextEncoder||c,e.TextDecoder=e.TextDecoder||d;}("undefined"!=typeof window?window:s),function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t);}function o(e){return o=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},o(e)}function i(e,t){return i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},i(e,t)}function c(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return !1}}function a(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function u(e,t){return !t||"object"!=typeof t&&"function"!=typeof t?a(e):t}function l(e){var t=c();return function(){var n,r=o(e);if(t){var i=o(this).constructor;n=Reflect.construct(r,arguments,i);}else n=r.apply(this,arguments);return u(this,n)}}function f(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=o(e)););return e}function d(e,t,n){return d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var r=f(e,t);if(r){var o=Object.getOwnPropertyDescriptor(r,t);return o.get?o.get.call(n):o.value}},d(e,t,n||e)}var h=function(){function t(){e(this,t),Object.defineProperty(this,"listeners",{value:{},writable:!0,configurable:!0});}return n(t,[{key:"addEventListener",value:function(e,t,n){e in this.listeners||(this.listeners[e]=[]),this.listeners[e].push({callback:t,options:n});}},{key:"removeEventListener",value:function(e,t){if(e in this.listeners)for(var n=this.listeners[e],r=0,o=n.length;r<o;r++)if(n[r].callback===t)return void n.splice(r,1)}},{key:"dispatchEvent",value:function(e){if(e.type in this.listeners){for(var t=this.listeners[e.type].slice(),n=0,r=t.length;n<r;n++){var o=t[n];try{o.callback.call(this,e);}catch(e){Promise.resolve().then((function(){throw e}));}o.options&&o.options.once&&this.removeEventListener(e.type,o.callback);}return !e.defaultPrevented}}}]),t}(),p=function(t){r(c,t);var i=l(c);function c(){var t;return e(this,c),(t=i.call(this)).listeners||h.call(a(t)),Object.defineProperty(a(t),"aborted",{value:!1,writable:!0,configurable:!0}),Object.defineProperty(a(t),"onabort",{value:null,writable:!0,configurable:!0}),t}return n(c,[{key:"toString",value:function(){return "[object AbortSignal]"}},{key:"dispatchEvent",value:function(e){"abort"===e.type&&(this.aborted=!0,"function"==typeof this.onabort&&this.onabort.call(this,e)),d(o(c.prototype),"dispatchEvent",this).call(this,e);}}]),c}(h),y=function(){function t(){e(this,t),Object.defineProperty(this,"signal",{value:new p,writable:!0,configurable:!0});}return n(t,[{key:"abort",value:function(){var e;try{e=new Event("abort");}catch(t){"undefined"!=typeof document?document.createEvent?(e=document.createEvent("Event")).initEvent("abort",!1,!1):(e=document.createEventObject()).type="abort":e={type:"abort",bubbles:!1,cancelable:!1};}this.signal.dispatchEvent(e);}},{key:"toString",value:function(){return "[object AbortController]"}}]),t}();function v(e){return e.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL?(console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill"),!0):"function"==typeof e.Request&&!e.Request.prototype.hasOwnProperty("signal")||!e.AbortController}"undefined"!=typeof Symbol&&Symbol.toStringTag&&(y.prototype[Symbol.toStringTag]="AbortController",p.prototype[Symbol.toStringTag]="AbortSignal"),function(e){v(e)&&(e.AbortController=y,e.AbortSignal=p);}("undefined"!=typeof self?self:s);}();var Wc=l((function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){var e=this;this.locked=new Map,this.addToLocked=function(t,n){var r=e.locked.get(t);void 0===r?void 0===n?e.locked.set(t,[]):e.locked.set(t,[n]):void 0!==n&&(r.unshift(n),e.locked.set(t,r));},this.isLocked=function(t){return e.locked.has(t)},this.lock=function(t){return new Promise((function(n,r){e.isLocked(t)?e.addToLocked(t,n):(e.addToLocked(t),n());}))},this.unlock=function(t){var n=e.locked.get(t);if(void 0!==n&&0!==n.length){var r=n.pop();e.locked.set(t,n),void 0!==r&&setTimeout(r,0);}else e.locked.delete(t);};}return e.getInstance=function(){return void 0===e.instance&&(e.instance=new e),e.instance},e}();t.default=function(){return n.getInstance()};}));u(Wc);var Zc=l((function(e,t){var n=s&&s.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function c(e){try{s(r.next(e));}catch(e){i(e);}}function a(e){try{s(r.throw(e));}catch(e){i(e);}}function s(e){e.done?o(e.value):new n((function(t){t(e.value);})).then(c,a);}s((r=r.apply(e,t||[])).next());}))},r=s&&s.__generator||function(e,t){var n,r,o,i,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,r=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(o=c.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){c=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){c.label=i[1];break}if(6===i[0]&&c.label<o[1]){c.label=o[1],o=i;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(i);break}o[2]&&c.ops.pop(),c.trys.pop();continue}i=t.call(e,c);}catch(e){i=[6,e],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,a])}}};Object.defineProperty(t,"__esModule",{value:!0});var o="browser-tabs-lock-key";function i(e){return new Promise((function(t){return setTimeout(t,e)}))}function c(e){for(var t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",n="",r=0;r<e;r++){n+=t[Math.floor(Math.random()*t.length)];}return n}var a=function(){function e(){this.acquiredIatSet=new Set,this.id=Date.now().toString()+c(15),this.acquireLock=this.acquireLock.bind(this),this.releaseLock=this.releaseLock.bind(this),this.releaseLock__private__=this.releaseLock__private__.bind(this),this.waitForSomethingToChange=this.waitForSomethingToChange.bind(this),this.refreshLockWhileAcquired=this.refreshLockWhileAcquired.bind(this),void 0===e.waiters&&(e.waiters=[]);}return e.prototype.acquireLock=function(t,a){return void 0===a&&(a=5e3),n(this,void 0,void 0,(function(){var n,s,u,l,f,d;return r(this,(function(r){switch(r.label){case 0:n=Date.now()+c(4),s=Date.now()+a,u=o+"-"+t,l=window.localStorage,r.label=1;case 1:return Date.now()<s?[4,i(30)]:[3,8];case 2:return r.sent(),null!==l.getItem(u)?[3,5]:(f=this.id+"-"+t+"-"+n,[4,i(Math.floor(25*Math.random()))]);case 3:return r.sent(),l.setItem(u,JSON.stringify({id:this.id,iat:n,timeoutKey:f,timeAcquired:Date.now(),timeRefreshed:Date.now()})),[4,i(30)];case 4:return r.sent(),null!==(d=l.getItem(u))&&(d=JSON.parse(d)).id===this.id&&d.iat===n?(this.acquiredIatSet.add(n),this.refreshLockWhileAcquired(u,n),[2,!0]):[3,7];case 5:return e.lockCorrector(),[4,this.waitForSomethingToChange(s)];case 6:r.sent(),r.label=7;case 7:return n=Date.now()+c(4),[3,1];case 8:return [2,!1]}}))}))},e.prototype.refreshLockWhileAcquired=function(e,t){return n(this,void 0,void 0,(function(){var o=this;return r(this,(function(i){return setTimeout((function(){return n(o,void 0,void 0,(function(){var n,o;return r(this,(function(r){switch(r.label){case 0:return [4,Wc.default().lock(t)];case 1:return r.sent(),this.acquiredIatSet.has(t)?(n=window.localStorage,null===(o=n.getItem(e))?(Wc.default().unlock(t),[2]):((o=JSON.parse(o)).timeRefreshed=Date.now(),n.setItem(e,JSON.stringify(o)),Wc.default().unlock(t),this.refreshLockWhileAcquired(e,t),[2])):(Wc.default().unlock(t),[2])}}))}))}),1e3),[2]}))}))},e.prototype.waitForSomethingToChange=function(t){return n(this,void 0,void 0,(function(){return r(this,(function(n){switch(n.label){case 0:return [4,new Promise((function(n){var r=!1,o=Date.now(),i=!1;function c(){if(i||(window.removeEventListener("storage",c),e.removeFromWaiting(c),clearTimeout(a),i=!0),!r){r=!0;var t=50-(Date.now()-o);t>0?setTimeout(n,t):n();}}window.addEventListener("storage",c),e.addToWaiting(c);var a=setTimeout(c,Math.max(0,t-Date.now()));}))];case 1:return n.sent(),[2]}}))}))},e.addToWaiting=function(t){this.removeFromWaiting(t),void 0!==e.waiters&&e.waiters.push(t);},e.removeFromWaiting=function(t){void 0!==e.waiters&&(e.waiters=e.waiters.filter((function(e){return e!==t})));},e.notifyWaiters=function(){void 0!==e.waiters&&e.waiters.slice().forEach((function(e){return e()}));},e.prototype.releaseLock=function(e){return n(this,void 0,void 0,(function(){return r(this,(function(t){switch(t.label){case 0:return [4,this.releaseLock__private__(e)];case 1:return [2,t.sent()]}}))}))},e.prototype.releaseLock__private__=function(t){return n(this,void 0,void 0,(function(){var n,i,c;return r(this,(function(r){switch(r.label){case 0:return n=window.localStorage,i=o+"-"+t,null===(c=n.getItem(i))?[2]:(c=JSON.parse(c)).id!==this.id?[3,2]:[4,Wc.default().lock(c.iat)];case 1:r.sent(),this.acquiredIatSet.delete(c.iat),n.removeItem(i),Wc.default().unlock(c.iat),e.notifyWaiters(),r.label=2;case 2:return [2]}}))}))},e.lockCorrector=function(){for(var t=Date.now()-5e3,n=window.localStorage,r=Object.keys(n),i=!1,c=0;c<r.length;c++){var a=r[c];if(a.includes(o)){var s=n.getItem(a);null!==s&&(void 0===(s=JSON.parse(s)).timeRefreshed&&s.timeAcquired<t||void 0!==s.timeRefreshed&&s.timeRefreshed<t)&&(n.removeItem(a),i=!0);}}i&&e.notifyWaiters();},e.waiters=void 0,e}();t.default=a;})),Ec=u(Zc),Gc={timeoutInSeconds:60},Pc=["login_required","consent_required","interaction_required","account_selection_required","access_denied"],Ac={name:"auth0-spa-js",version:"1.22.5"},Xc=function(){return Date.now()},Fc=function(e){function n(t,r){var o=e.call(this,r)||this;return o.error=t,o.error_description=r,Object.setPrototypeOf(o,n.prototype),o}return t(n,e),n.fromPayload=function(e){return new n(e.error,e.error_description)},n}(Error),Kc=function(e){function n(t,r,o,i){void 0===i&&(i=null);var c=e.call(this,t,r)||this;return c.state=o,c.appState=i,Object.setPrototypeOf(c,n.prototype),c}return t(n,e),n}(Fc),Nc=function(e){function n(){var t=e.call(this,"timeout","Timeout")||this;return Object.setPrototypeOf(t,n.prototype),t}return t(n,e),n}(Fc),Uc=function(e){function n(t){var r=e.call(this)||this;return r.popup=t,Object.setPrototypeOf(r,n.prototype),r}return t(n,e),n}(Nc),Hc=function(e){function n(t){var r=e.call(this,"cancelled","Popup closed")||this;return r.popup=t,Object.setPrototypeOf(r,n.prototype),r}return t(n,e),n}(Fc),Dc=function(e){function n(t,r,o){var i=e.call(this,t,r)||this;return i.mfa_token=o,Object.setPrototypeOf(i,n.prototype),i}return t(n,e),n}(Fc),Yc=function(e){function n(t,r){var o=e.call(this,"missing_refresh_token","Missing Refresh Token (audience: '".concat(ta(t,["default"]),"', scope: '").concat(ta(r),"')"))||this;return o.audience=t,o.scope=r,Object.setPrototypeOf(o,n.prototype),o}return t(n,e),n}(Fc),Jc=function(e){return new Promise((function(t,n){var r,o=setInterval((function(){e.popup&&e.popup.closed&&(clearInterval(o),clearTimeout(i),window.removeEventListener("message",r,!1),n(new Hc(e.popup)));}),1e3),i=setTimeout((function(){clearInterval(o),n(new Uc(e.popup)),window.removeEventListener("message",r,!1);}),1e3*(e.timeoutInSeconds||60));r=function(c){if(c.data&&"authorization_response"===c.data.type){if(clearTimeout(i),clearInterval(o),window.removeEventListener("message",r,!1),e.popup.close(),c.data.response.error)return n(Fc.fromPayload(c.data.response));t(c.data.response);}},window.addEventListener("message",r);}))},Vc=function(){return window.crypto||window.msCrypto},zc=function(){var e=Vc();return e.subtle||e.webkitSubtle},Mc=function(){var e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.",t="";return Array.from(Vc().getRandomValues(new Uint8Array(43))).forEach((function(n){return t+=e[n%e.length]})),t},Bc=function(e){return btoa(e)},Qc=function(e){return Object.keys(e).filter((function(t){return void 0!==e[t]})).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")},qc=function(e){return o(void 0,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return t=zc().digest({name:"SHA-256"},(new TextEncoder).encode(e)),window.msCrypto?[2,new Promise((function(e,n){t.oncomplete=function(t){e(t.target.result);},t.onerror=function(e){n(e.error);},t.onabort=function(){n("The digest operation was aborted");};}))]:[4,t];case 1:return [2,n.sent()]}}))}))},$c=function(e){return function(e){return decodeURIComponent(atob(e).split("").map((function(e){return "%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)})).join(""))}(e.replace(/_/g,"/").replace(/-/g,"+"))},ea=function(e){var t=new Uint8Array(e);return function(e){var t={"+":"-","/":"_","=":""};return e.replace(/[+/=]/g,(function(e){return t[e]}))}(window.btoa(String.fromCharCode.apply(String,a([],c(Array.from(t)),!1))))};function ta(e,t){return void 0===t&&(t=[]),e&&!t.includes(e)?e:""}var na=function(e,t){return o(void 0,void 0,void 0,(function(){var n,r;return i(this,(function(o){switch(o.label){case 0:return [4,(i=e,c=t,c=c||{},new Promise((function(e,t){var n=new XMLHttpRequest,r=[],o=[],a={},s=function(){return {ok:2==(n.status/100|0),statusText:n.statusText,status:n.status,url:n.responseURL,text:function(){return Promise.resolve(n.responseText)},json:function(){return Promise.resolve(n.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([n.response]))},clone:s,headers:{keys:function(){return r},entries:function(){return o},get:function(e){return a[e.toLowerCase()]},has:function(e){return e.toLowerCase()in a}}}};for(var u in n.open(c.method||"get",i,!0),n.onload=function(){n.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,(function(e,t,n){r.push(t=t.toLowerCase()),o.push([t,n]),a[t]=a[t]?a[t]+","+n:n;})),e(s());},n.onerror=t,n.withCredentials="include"==c.credentials,c.headers)n.setRequestHeader(u,c.headers[u]);n.send(c.body||null);})))];case 1:return n=o.sent(),r={ok:n.ok},[4,n.json()];case 2:return [2,(r.json=o.sent(),r)]}var i,c;}))}))},ra=function(e,t,n){return o(void 0,void 0,void 0,(function(){var r,o;return i(this,(function(i){return r=new AbortController,t.signal=r.signal,[2,Promise.race([na(e,t),new Promise((function(e,t){o=setTimeout((function(){r.abort(),t(new Error("Timeout when executing 'fetch'"));}),n);}))]).finally((function(){clearTimeout(o);}))]}))}))},oa=function(e,t,n,r,c,a,s){return o(void 0,void 0,void 0,(function(){return i(this,(function(o){return [2,(i={auth:{audience:t,scope:n},timeout:c,fetchUrl:e,fetchOptions:r,useFormData:s},u=a,new Promise((function(e,t){var n=new MessageChannel;n.port1.onmessage=function(n){n.data.error?t(new Error(n.data.error)):e(n.data);},u.postMessage(i,[n.port2]);})))];var i,u;}))}))},ia=function(e,t,n,r,c,a,s){return void 0===s&&(s=1e4),o(void 0,void 0,void 0,(function(){return i(this,(function(o){return c?[2,oa(e,t,n,r,s,c,a)]:[2,ra(e,r,s)]}))}))};function ca(e,t,n,c,a,s,u){return o(this,void 0,void 0,(function(){var o,l,f,d,h,p,y,v,m;return i(this,(function(i){switch(i.label){case 0:o=null,f=0,i.label=1;case 1:if(!(f<3))return [3,6];i.label=2;case 2:return i.trys.push([2,4,,5]),[4,ia(e,n,c,a,s,u,t)];case 3:return l=i.sent(),o=null,[3,6];case 4:return d=i.sent(),o=d,[3,5];case 5:return f++,[3,1];case 6:if(o)throw o.message=o.message||"Failed to fetch",o;if(h=l.json,p=h.error,y=h.error_description,v=r(h,["error","error_description"]),!l.ok){if(m=y||"HTTP error. Unable to fetch ".concat(e),"mfa_required"===p)throw new Dc(p,m,v.mfa_token);throw new Fc(p||"request_error",m)}return [2,v]}}))}))}function aa(e,t){var n=e.baseUrl,c=e.timeout,a=e.audience,s=e.scope,u=e.auth0Client,l=e.useFormData,f=r(e,["baseUrl","timeout","audience","scope","auth0Client","useFormData"]);return o(this,void 0,void 0,(function(){var e;return i(this,(function(r){switch(r.label){case 0:return e=l?Qc(f):JSON.stringify(f),[4,ca("".concat(n,"/oauth/token"),c,a||"default",s,{method:"POST",body:e,headers:{"Content-Type":l?"application/x-www-form-urlencoded":"application/json","Auth0-Client":btoa(JSON.stringify(u||Ac))}},t,l)];case 1:return [2,r.sent()]}}))}))}var sa=function(e){return Array.from(new Set(e))},ua=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return sa(e.join(" ").trim().split(/\s+/)).join(" ")},la=function(){function e(e,t){void 0===t&&(t="@@auth0spajs@@"),this.prefix=t,this.client_id=e.client_id,this.scope=e.scope,this.audience=e.audience;}return e.prototype.toKey=function(){return "".concat(this.prefix,"::").concat(this.client_id,"::").concat(this.audience,"::").concat(this.scope)},e.fromKey=function(t){var n=c(t.split("::"),4),r=n[0],o=n[1],i=n[2];return new e({client_id:o,scope:n[3],audience:i},r)},e.fromCacheEntry=function(t){return new e({scope:t.scope,audience:t.audience,client_id:t.client_id})},e}(),fa=function(){function e(){}return e.prototype.set=function(e,t){localStorage.setItem(e,JSON.stringify(t));},e.prototype.get=function(e){var t=window.localStorage.getItem(e);if(t)try{return JSON.parse(t)}catch(e){return}},e.prototype.remove=function(e){localStorage.removeItem(e);},e.prototype.allKeys=function(){return Object.keys(window.localStorage).filter((function(e){return e.startsWith("@@auth0spajs@@")}))},e}(),da=function(){var e;this.enclosedCache=(e={},{set:function(t,n){e[t]=n;},get:function(t){var n=e[t];if(n)return n},remove:function(t){delete e[t];},allKeys:function(){return Object.keys(e)}});},ha=function(){function e(e,t,n){this.cache=e,this.keyManifest=t,this.nowProvider=n,this.nowProvider=this.nowProvider||Xc;}return e.prototype.get=function(e,t){var n;return void 0===t&&(t=0),o(this,void 0,void 0,(function(){var r,o,c,a,s;return i(this,(function(i){switch(i.label){case 0:return [4,this.cache.get(e.toKey())];case 1:return (r=i.sent())?[3,4]:[4,this.getCacheKeys()];case 2:return (o=i.sent())?(c=this.matchExistingCacheKey(e,o))?[4,this.cache.get(c)]:[3,4]:[2];case 3:r=i.sent(),i.label=4;case 4:return r?[4,this.nowProvider()]:[2];case 5:return a=i.sent(),s=Math.floor(a/1e3),r.expiresAt-t<s?r.body.refresh_token?(r.body={refresh_token:r.body.refresh_token},[4,this.cache.set(e.toKey(),r)]):[3,7]:[3,10];case 6:return i.sent(),[2,r.body];case 7:return [4,this.cache.remove(e.toKey())];case 8:return i.sent(),[4,null===(n=this.keyManifest)||void 0===n?void 0:n.remove(e.toKey())];case 9:return i.sent(),[2];case 10:return [2,r.body]}}))}))},e.prototype.set=function(e){var t;return o(this,void 0,void 0,(function(){var n,r;return i(this,(function(o){switch(o.label){case 0:return n=new la({client_id:e.client_id,scope:e.scope,audience:e.audience}),[4,this.wrapCacheEntry(e)];case 1:return r=o.sent(),[4,this.cache.set(n.toKey(),r)];case 2:return o.sent(),[4,null===(t=this.keyManifest)||void 0===t?void 0:t.add(n.toKey())];case 3:return o.sent(),[2]}}))}))},e.prototype.clear=function(e){var t;return o(this,void 0,void 0,(function(){var n,r=this;return i(this,(function(c){switch(c.label){case 0:return [4,this.getCacheKeys()];case 1:return (n=c.sent())?[4,n.filter((function(t){return !e||t.includes(e)})).reduce((function(e,t){return o(r,void 0,void 0,(function(){return i(this,(function(n){switch(n.label){case 0:return [4,e];case 1:return n.sent(),[4,this.cache.remove(t)];case 2:return n.sent(),[2]}}))}))}),Promise.resolve())]:[2];case 2:return c.sent(),[4,null===(t=this.keyManifest)||void 0===t?void 0:t.clear()];case 3:return c.sent(),[2]}}))}))},e.prototype.clearSync=function(e){var t=this,n=this.cache.allKeys();n&&n.filter((function(t){return !e||t.includes(e)})).forEach((function(e){t.cache.remove(e);}));},e.prototype.wrapCacheEntry=function(e){return o(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(o){switch(o.label){case 0:return [4,this.nowProvider()];case 1:return t=o.sent(),n=Math.floor(t/1e3)+e.expires_in,r=Math.min(n,e.decodedToken.claims.exp),[2,{body:e,expiresAt:r}]}}))}))},e.prototype.getCacheKeys=function(){var e;return o(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return this.keyManifest?[4,this.keyManifest.get()]:[3,2];case 1:return t=null===(e=n.sent())||void 0===e?void 0:e.keys,[3,4];case 2:return [4,this.cache.allKeys()];case 3:t=n.sent(),n.label=4;case 4:return [2,t]}}))}))},e.prototype.matchExistingCacheKey=function(e,t){return t.filter((function(t){var n=la.fromKey(t),r=new Set(n.scope&&n.scope.split(" ")),o=e.scope.split(" "),i=n.scope&&o.reduce((function(e,t){return e&&r.has(t)}),!0);return "@@auth0spajs@@"===n.prefix&&n.client_id===e.client_id&&n.audience===e.audience&&i}))[0]},e}(),pa=function(){function e(e,t){this.storage=e,this.clientId=t,this.storageKey="".concat("a0.spajs.txs",".").concat(this.clientId),this.transaction=this.storage.get(this.storageKey);}return e.prototype.create=function(e){this.transaction=e,this.storage.save(this.storageKey,e,{daysUntilExpire:1});},e.prototype.get=function(){return this.transaction},e.prototype.remove=function(){delete this.transaction,this.storage.remove(this.storageKey);},e}(),ya=function(e){return "number"==typeof e},va=["iss","aud","exp","nbf","iat","jti","azp","nonce","auth_time","at_hash","c_hash","acr","amr","sub_jwk","cnf","sip_from_tag","sip_date","sip_callid","sip_cseq_num","sip_via_branch","orig","dest","mky","events","toe","txn","rph","sid","vot","vtm"],ma=function(e){if(!e.id_token)throw new Error("ID token is required but missing");var t=function(e){var t=e.split("."),n=c(t,3),r=n[0],o=n[1],i=n[2];if(3!==t.length||!r||!o||!i)throw new Error("ID token could not be decoded");var a=JSON.parse($c(o)),s={__raw:e},u={};return Object.keys(a).forEach((function(e){s[e]=a[e],va.includes(e)||(u[e]=a[e]);})),{encoded:{header:r,payload:o,signature:i},header:JSON.parse($c(r)),claims:s,user:u}}(e.id_token);if(!t.claims.iss)throw new Error("Issuer (iss) claim must be a string present in the ID token");if(t.claims.iss!==e.iss)throw new Error('Issuer (iss) claim mismatch in the ID token; expected "'.concat(e.iss,'", found "').concat(t.claims.iss,'"'));if(!t.user.sub)throw new Error("Subject (sub) claim must be a string present in the ID token");if("RS256"!==t.header.alg)throw new Error('Signature algorithm of "'.concat(t.header.alg,'" is not supported. Expected the ID token to be signed with "RS256".'));if(!t.claims.aud||"string"!=typeof t.claims.aud&&!Array.isArray(t.claims.aud))throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");if(Array.isArray(t.claims.aud)){if(!t.claims.aud.includes(e.aud))throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(e.aud,'" but was not one of "').concat(t.claims.aud.join(", "),'"'));if(t.claims.aud.length>1){if(!t.claims.azp)throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");if(t.claims.azp!==e.aud)throw new Error('Authorized Party (azp) claim mismatch in the ID token; expected "'.concat(e.aud,'", found "').concat(t.claims.azp,'"'))}}else if(t.claims.aud!==e.aud)throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(e.aud,'" but found "').concat(t.claims.aud,'"'));if(e.nonce){if(!t.claims.nonce)throw new Error("Nonce (nonce) claim must be a string present in the ID token");if(t.claims.nonce!==e.nonce)throw new Error('Nonce (nonce) claim mismatch in the ID token; expected "'.concat(e.nonce,'", found "').concat(t.claims.nonce,'"'))}if(e.max_age&&!ya(t.claims.auth_time))throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");if(!ya(t.claims.exp))throw new Error("Expiration Time (exp) claim must be a number present in the ID token");if(!ya(t.claims.iat))throw new Error("Issued At (iat) claim must be a number present in the ID token");var n=e.leeway||60,r=new Date(e.now||Date.now()),o=new Date(0),i=new Date(0),a=new Date(0);if(a.setUTCSeconds(parseInt(t.claims.auth_time)+e.max_age+n),o.setUTCSeconds(t.claims.exp+n),i.setUTCSeconds(t.claims.nbf-n),r>o)throw new Error("Expiration Time (exp) claim error in the ID token; current time (".concat(r,") is after expiration time (").concat(o,")"));if(ya(t.claims.nbf)&&r<i)throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Currrent time (".concat(r,") is before ").concat(i));if(ya(t.claims.auth_time)&&r>a)throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Currrent time (".concat(r,") is after last auth at ").concat(a));if(e.organizationId){if(!t.claims.org_id)throw new Error("Organization ID (org_id) claim must be a string present in the ID token");if(e.organizationId!==t.claims.org_id)throw new Error('Organization ID (org_id) claim mismatch in the ID token; expected "'.concat(e.organizationId,'", found "').concat(t.claims.org_id,'"'))}return t},ba=l((function(e,t){var n=s&&s.__assign||function(){return n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)};function r(e,t){if(!t)return "";var n="; "+e;return !0===t?n:n+"="+t}function o(e,t,n){return encodeURIComponent(e).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/\(/g,"%28").replace(/\)/g,"%29")+"="+encodeURIComponent(t).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent)+function(e){if("number"==typeof e.expires){var t=new Date;t.setMilliseconds(t.getMilliseconds()+864e5*e.expires),e.expires=t;}return r("Expires",e.expires?e.expires.toUTCString():"")+r("Domain",e.domain)+r("Path",e.path)+r("Secure",e.secure)+r("SameSite",e.sameSite)}(n)}function i(e){for(var t={},n=e?e.split("; "):[],r=/(%[\dA-F]{2})+/gi,o=0;o<n.length;o++){var i=n[o].split("="),c=i.slice(1).join("=");'"'===c.charAt(0)&&(c=c.slice(1,-1));try{t[i[0].replace(r,decodeURIComponent)]=c.replace(r,decodeURIComponent);}catch(e){}}return t}function c(){return i(document.cookie)}function a(e,t,r){document.cookie=o(e,t,n({path:"/"},r));}t.__esModule=!0,t.encode=o,t.parse=i,t.getAll=c,t.get=function(e){return c()[e]},t.set=a,t.remove=function(e,t){a(e,"",n(n({},t),{expires:-1}));};}));u(ba),ba.encode,ba.parse,ba.getAll;var ga=ba.get,wa=ba.set,Sa=ba.remove,ka={get:function(e){var t=ga(e);if(void 0!==t)return JSON.parse(t)},save:function(e,t,n){var r={};"https:"===window.location.protocol&&(r={secure:!0,sameSite:"none"}),(null==n?void 0:n.daysUntilExpire)&&(r.expires=n.daysUntilExpire),(null==n?void 0:n.cookieDomain)&&(r.domain=n.cookieDomain),wa(e,JSON.stringify(t),r);},remove:function(e,t){var n={};(null==t?void 0:t.cookieDomain)&&(n.domain=t.cookieDomain),Sa(e,n);}},_a={get:function(e){var t=ka.get(e);return t||ka.get("".concat("_legacy_").concat(e))},save:function(e,t,n){var r={};"https:"===window.location.protocol&&(r={secure:!0}),(null==n?void 0:n.daysUntilExpire)&&(r.expires=n.daysUntilExpire),wa("".concat("_legacy_").concat(e),JSON.stringify(t),r),ka.save(e,t,n);},remove:function(e,t){var n={};(null==t?void 0:t.cookieDomain)&&(n.domain=t.cookieDomain),Sa(e,n),ka.remove(e,t),ka.remove("".concat("_legacy_").concat(e),t);}},Ia={get:function(e){if("undefined"!=typeof sessionStorage){var t=sessionStorage.getItem(e);if(void 0!==t)return JSON.parse(t)}},save:function(e,t){sessionStorage.setItem(e,JSON.stringify(t));},remove:function(e){sessionStorage.removeItem(e);}};function Oa(e,t,n){var r=void 0===t?null:t,o=function(e,t){var n=atob(e);if(t){for(var r=new Uint8Array(n.length),o=0,i=n.length;o<i;++o)r[o]=n.charCodeAt(o);return String.fromCharCode.apply(null,new Uint16Array(r.buffer))}return n}(e,void 0!==n&&n),i=o.indexOf("\n",10)+1,c=o.substring(i)+(r?"//# sourceMappingURL="+r:""),a=new Blob([c],{type:"application/javascript"});return URL.createObjectURL(a)}var xa,Ta,Ca,ja,Ra=(xa="Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7dmFyIHQ9ZnVuY3Rpb24oZSxyKXtyZXR1cm4gdD1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fHtfX3Byb3RvX186W119aW5zdGFuY2VvZiBBcnJheSYmZnVuY3Rpb24odCxlKXt0Ll9fcHJvdG9fXz1lfXx8ZnVuY3Rpb24odCxlKXtmb3IodmFyIHIgaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxyKSYmKHRbcl09ZVtyXSl9LHQoZSxyKX07ZnVuY3Rpb24gZShlLHIpe2lmKCJmdW5jdGlvbiIhPXR5cGVvZiByJiZudWxsIT09cil0aHJvdyBuZXcgVHlwZUVycm9yKCJDbGFzcyBleHRlbmRzIHZhbHVlICIrU3RyaW5nKHIpKyIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbCIpO2Z1bmN0aW9uIG4oKXt0aGlzLmNvbnN0cnVjdG9yPWV9dChlLHIpLGUucHJvdG90eXBlPW51bGw9PT1yP09iamVjdC5jcmVhdGUocik6KG4ucHJvdG90eXBlPXIucHJvdG90eXBlLG5ldyBuKX12YXIgcj1mdW5jdGlvbigpe3JldHVybiByPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKHQpe2Zvcih2YXIgZSxyPTEsbj1hcmd1bWVudHMubGVuZ3RoO3I8bjtyKyspZm9yKHZhciBvIGluIGU9YXJndW1lbnRzW3JdKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLG8pJiYodFtvXT1lW29dKTtyZXR1cm4gdH0sci5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2Z1bmN0aW9uIG4odCxlLHIsbil7cmV0dXJuIG5ldyhyfHwocj1Qcm9taXNlKSkoKGZ1bmN0aW9uKG8sYyl7ZnVuY3Rpb24gaSh0KXt0cnl7cyhuLm5leHQodCkpfWNhdGNoKHQpe2ModCl9fWZ1bmN0aW9uIGEodCl7dHJ5e3Mobi50aHJvdyh0KSl9Y2F0Y2godCl7Yyh0KX19ZnVuY3Rpb24gcyh0KXt2YXIgZTt0LmRvbmU/byh0LnZhbHVlKTooZT10LnZhbHVlLGUgaW5zdGFuY2VvZiByP2U6bmV3IHIoKGZ1bmN0aW9uKHQpe3QoZSl9KSkpLnRoZW4oaSxhKX1zKChuPW4uYXBwbHkodCxlfHxbXSkpLm5leHQoKSl9KSl9ZnVuY3Rpb24gbyh0LGUpe3ZhciByLG4sbyxjLGk9e2xhYmVsOjAsc2VudDpmdW5jdGlvbigpe2lmKDEmb1swXSl0aHJvdyBvWzFdO3JldHVybiBvWzFdfSx0cnlzOltdLG9wczpbXX07cmV0dXJuIGM9e25leHQ6YSgwKSx0aHJvdzphKDEpLHJldHVybjphKDIpfSwiZnVuY3Rpb24iPT10eXBlb2YgU3ltYm9sJiYoY1tTeW1ib2wuaXRlcmF0b3JdPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KSxjO2Z1bmN0aW9uIGEoYyl7cmV0dXJuIGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihjKXtpZihyKXRocm93IG5ldyBUeXBlRXJyb3IoIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy4iKTtmb3IoO2k7KXRyeXtpZihyPTEsbiYmKG89MiZjWzBdP24ucmV0dXJuOmNbMF0/bi50aHJvd3x8KChvPW4ucmV0dXJuKSYmby5jYWxsKG4pLDApOm4ubmV4dCkmJiEobz1vLmNhbGwobixjWzFdKSkuZG9uZSlyZXR1cm4gbztzd2l0Y2gobj0wLG8mJihjPVsyJmNbMF0sby52YWx1ZV0pLGNbMF0pe2Nhc2UgMDpjYXNlIDE6bz1jO2JyZWFrO2Nhc2UgNDpyZXR1cm4gaS5sYWJlbCsrLHt2YWx1ZTpjWzFdLGRvbmU6ITF9O2Nhc2UgNTppLmxhYmVsKyssbj1jWzFdLGM9WzBdO2NvbnRpbnVlO2Nhc2UgNzpjPWkub3BzLnBvcCgpLGkudHJ5cy5wb3AoKTtjb250aW51ZTtkZWZhdWx0OmlmKCEobz1pLnRyeXMsKG89by5sZW5ndGg+MCYmb1tvLmxlbmd0aC0xXSl8fDYhPT1jWzBdJiYyIT09Y1swXSkpe2k9MDtjb250aW51ZX1pZigzPT09Y1swXSYmKCFvfHxjWzFdPm9bMF0mJmNbMV08b1szXSkpe2kubGFiZWw9Y1sxXTticmVha31pZig2PT09Y1swXSYmaS5sYWJlbDxvWzFdKXtpLmxhYmVsPW9bMV0sbz1jO2JyZWFrfWlmKG8mJmkubGFiZWw8b1syXSl7aS5sYWJlbD1vWzJdLGkub3BzLnB1c2goYyk7YnJlYWt9b1syXSYmaS5vcHMucG9wKCksaS50cnlzLnBvcCgpO2NvbnRpbnVlfWM9ZS5jYWxsKHQsaSl9Y2F0Y2godCl7Yz1bNix0XSxuPTB9ZmluYWxseXtyPW89MH1pZig1JmNbMF0pdGhyb3cgY1sxXTtyZXR1cm57dmFsdWU6Y1swXT9jWzFdOnZvaWQgMCxkb25lOiEwfX0oW2MsYV0pfX19ZnVuY3Rpb24gYyh0LGUpe3JldHVybiB2b2lkIDA9PT1lJiYoZT1bXSksdCYmIWUuaW5jbHVkZXModCk/dDoiIn12YXIgaT1mdW5jdGlvbih0KXtmdW5jdGlvbiByKGUsbil7dmFyIG89dC5jYWxsKHRoaXMsbil8fHRoaXM7cmV0dXJuIG8uZXJyb3I9ZSxvLmVycm9yX2Rlc2NyaXB0aW9uPW4sT2JqZWN0LnNldFByb3RvdHlwZU9mKG8sci5wcm90b3R5cGUpLG99cmV0dXJuIGUocix0KSxyLmZyb21QYXlsb2FkPWZ1bmN0aW9uKHQpe3JldHVybiBuZXcgcih0LmVycm9yLHQuZXJyb3JfZGVzY3JpcHRpb24pfSxyfShFcnJvcik7IWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIoZSxuLG8sYyl7dm9pZCAwPT09YyYmKGM9bnVsbCk7dmFyIGk9dC5jYWxsKHRoaXMsZSxuKXx8dGhpcztyZXR1cm4gaS5zdGF0ZT1vLGkuYXBwU3RhdGU9YyxPYmplY3Quc2V0UHJvdG90eXBlT2YoaSxyLnByb3RvdHlwZSksaX1lKHIsdCl9KGkpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIoZSl7dmFyIG49dC5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiBuLnBvcHVwPWUsT2JqZWN0LnNldFByb3RvdHlwZU9mKG4sci5wcm90b3R5cGUpLG59ZShyLHQpfShmdW5jdGlvbih0KXtmdW5jdGlvbiByKCl7dmFyIGU9dC5jYWxsKHRoaXMsInRpbWVvdXQiLCJUaW1lb3V0Iil8fHRoaXM7cmV0dXJuIE9iamVjdC5zZXRQcm90b3R5cGVPZihlLHIucHJvdG90eXBlKSxlfXJldHVybiBlKHIsdCkscn0oaSkpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIoZSl7dmFyIG49dC5jYWxsKHRoaXMsImNhbmNlbGxlZCIsIlBvcHVwIGNsb3NlZCIpfHx0aGlzO3JldHVybiBuLnBvcHVwPWUsT2JqZWN0LnNldFByb3RvdHlwZU9mKG4sci5wcm90b3R5cGUpLG59ZShyLHQpfShpKSxmdW5jdGlvbih0KXtmdW5jdGlvbiByKGUsbixvKXt2YXIgYz10LmNhbGwodGhpcyxlLG4pfHx0aGlzO3JldHVybiBjLm1mYV90b2tlbj1vLE9iamVjdC5zZXRQcm90b3R5cGVPZihjLHIucHJvdG90eXBlKSxjfWUocix0KX0oaSk7dmFyIGE9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gcihlLG4pe3ZhciBvPXQuY2FsbCh0aGlzLCJtaXNzaW5nX3JlZnJlc2hfdG9rZW4iLCJNaXNzaW5nIFJlZnJlc2ggVG9rZW4gKGF1ZGllbmNlOiAnIi5jb25jYXQoYyhlLFsiZGVmYXVsdCJdKSwiJywgc2NvcGU6ICciKS5jb25jYXQoYyhuKSwiJykiKSl8fHRoaXM7cmV0dXJuIG8uYXVkaWVuY2U9ZSxvLnNjb3BlPW4sT2JqZWN0LnNldFByb3RvdHlwZU9mKG8sci5wcm90b3R5cGUpLG99cmV0dXJuIGUocix0KSxyfShpKSxzPXt9LHU9ZnVuY3Rpb24odCxlKXtyZXR1cm4iIi5jb25jYXQodCwifCIpLmNvbmNhdChlKX07YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsKGZ1bmN0aW9uKHQpe3ZhciBlPXQuZGF0YSxjPWUudGltZW91dCxpPWUuYXV0aCxmPWUuZmV0Y2hVcmwsbD1lLmZldGNoT3B0aW9ucyxwPWUudXNlRm9ybURhdGEsaD1mdW5jdGlvbih0LGUpe3ZhciByPSJmdW5jdGlvbiI9PXR5cGVvZiBTeW1ib2wmJnRbU3ltYm9sLml0ZXJhdG9yXTtpZighcilyZXR1cm4gdDt2YXIgbixvLGM9ci5jYWxsKHQpLGk9W107dHJ5e2Zvcig7KHZvaWQgMD09PWV8fGUtLSA+MCkmJiEobj1jLm5leHQoKSkuZG9uZTspaS5wdXNoKG4udmFsdWUpfWNhdGNoKHQpe289e2Vycm9yOnR9fWZpbmFsbHl7dHJ5e24mJiFuLmRvbmUmJihyPWMucmV0dXJuKSYmci5jYWxsKGMpfWZpbmFsbHl7aWYobyl0aHJvdyBvLmVycm9yfX1yZXR1cm4gaX0odC5wb3J0cywxKVswXTtyZXR1cm4gbih2b2lkIDAsdm9pZCAwLHZvaWQgMCwoZnVuY3Rpb24oKXt2YXIgdCxlLG4seSx2LGIsZCx3LE8sXztyZXR1cm4gbyh0aGlzLChmdW5jdGlvbihvKXtzd2l0Y2goby5sYWJlbCl7Y2FzZSAwOm49KGU9aXx8e30pLmF1ZGllbmNlLHk9ZS5zY29wZSxvLmxhYmVsPTE7Y2FzZSAxOmlmKG8udHJ5cy5wdXNoKFsxLDcsLDhdKSwhKHY9cD8obT1sLmJvZHksaz1uZXcgVVJMU2VhcmNoUGFyYW1zKG0pLFA9e30say5mb3JFYWNoKChmdW5jdGlvbih0LGUpe1BbZV09dH0pKSxQKTpKU09OLnBhcnNlKGwuYm9keSkpLnJlZnJlc2hfdG9rZW4mJiJyZWZyZXNoX3Rva2VuIj09PXYuZ3JhbnRfdHlwZSl7aWYoYj1mdW5jdGlvbih0LGUpe3JldHVybiBzW3UodCxlKV19KG4seSksIWIpdGhyb3cgbmV3IGEobix5KTtsLmJvZHk9cD9uZXcgVVJMU2VhcmNoUGFyYW1zKHIocih7fSx2KSx7cmVmcmVzaF90b2tlbjpifSkpLnRvU3RyaW5nKCk6SlNPTi5zdHJpbmdpZnkocihyKHt9LHYpLHtyZWZyZXNoX3Rva2VuOmJ9KSl9ZD12b2lkIDAsImZ1bmN0aW9uIj09dHlwZW9mIEFib3J0Q29udHJvbGxlciYmKGQ9bmV3IEFib3J0Q29udHJvbGxlcixsLnNpZ25hbD1kLnNpZ25hbCksdz12b2lkIDAsby5sYWJlbD0yO2Nhc2UgMjpyZXR1cm4gby50cnlzLnB1c2goWzIsNCwsNV0pLFs0LFByb21pc2UucmFjZShbKGc9YyxuZXcgUHJvbWlzZSgoZnVuY3Rpb24odCl7cmV0dXJuIHNldFRpbWVvdXQodCxnKX0pKSksZmV0Y2goZixyKHt9LGwpKV0pXTtjYXNlIDM6cmV0dXJuIHc9by5zZW50KCksWzMsNV07Y2FzZSA0OnJldHVybiBPPW8uc2VudCgpLGgucG9zdE1lc3NhZ2Uoe2Vycm9yOk8ubWVzc2FnZX0pLFsyXTtjYXNlIDU6cmV0dXJuIHc/WzQsdy5qc29uKCldOihkJiZkLmFib3J0KCksaC5wb3N0TWVzc2FnZSh7ZXJyb3I6IlRpbWVvdXQgd2hlbiBleGVjdXRpbmcgJ2ZldGNoJyJ9KSxbMl0pO2Nhc2UgNjpyZXR1cm4odD1vLnNlbnQoKSkucmVmcmVzaF90b2tlbj8oZnVuY3Rpb24odCxlLHIpe3NbdShlLHIpXT10fSh0LnJlZnJlc2hfdG9rZW4sbix5KSxkZWxldGUgdC5yZWZyZXNoX3Rva2VuKTpmdW5jdGlvbih0LGUpe2RlbGV0ZSBzW3UodCxlKV19KG4seSksaC5wb3N0TWVzc2FnZSh7b2s6dy5vayxqc29uOnR9KSxbMyw4XTtjYXNlIDc6cmV0dXJuIF89by5zZW50KCksaC5wb3N0TWVzc2FnZSh7b2s6ITEsanNvbjp7ZXJyb3JfZGVzY3JpcHRpb246Xy5tZXNzYWdlfX0pLFszLDhdO2Nhc2UgODpyZXR1cm5bMl19dmFyIGcsbSxrLFB9KSl9KSl9KSl9KCk7Cgo=",Ta=null,Ca=!1,function(e){return ja=ja||Oa(xa,Ta,Ca),new Worker(ja,e)}),La={},Wa=function(){function e(e,t){this.cache=e,this.clientId=t,this.manifestKey=this.createManifestKeyFrom(this.clientId);}return e.prototype.add=function(e){var t;return o(this,void 0,void 0,(function(){var n,r;return i(this,(function(o){switch(o.label){case 0:return r=Set.bind,[4,this.cache.get(this.manifestKey)];case 1:return (n=new(r.apply(Set,[void 0,(null===(t=o.sent())||void 0===t?void 0:t.keys)||[]]))).add(e),[4,this.cache.set(this.manifestKey,{keys:a([],c(n),!1)})];case 2:return o.sent(),[2]}}))}))},e.prototype.remove=function(e){return o(this,void 0,void 0,(function(){var t,n;return i(this,(function(r){switch(r.label){case 0:return [4,this.cache.get(this.manifestKey)];case 1:return (t=r.sent())?((n=new Set(t.keys)).delete(e),n.size>0?[4,this.cache.set(this.manifestKey,{keys:a([],c(n),!1)})]:[3,3]):[3,5];case 2:case 4:return [2,r.sent()];case 3:return [4,this.cache.remove(this.manifestKey)];case 5:return [2]}}))}))},e.prototype.get=function(){return this.cache.get(this.manifestKey)},e.prototype.clear=function(){return this.cache.remove(this.manifestKey)},e.prototype.createManifestKeyFrom=function(e){return "".concat("@@auth0spajs@@","::").concat(e)},e}(),Za=new Ec,Ea={memory:function(){return (new da).enclosedCache},localstorage:function(){return new fa}},Ga=function(e){return Ea[e]},Pa=function(){return !/Trident.*rv:11\.0/.test(navigator.userAgent)},Aa=function(){function e(e){var t,n,c,a,s=this;if(this.options=e,this._releaseLockOnPageHide=function(){return o(s,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return [4,Za.releaseLock("auth0.lock.getTokenSilently")];case 1:return e.sent(),window.removeEventListener("pagehide",this._releaseLockOnPageHide),[2]}}))}))},"undefined"!=typeof window&&function(){if(!Vc())throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");if(void 0===zc())throw new Error("\n      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.\n    ")}(),e.cache&&e.cacheLocation&&console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`."),e.cache)c=e.cache;else {if(this.cacheLocation=e.cacheLocation||"memory",!Ga(this.cacheLocation))throw new Error('Invalid cache location "'.concat(this.cacheLocation,'"'));c=Ga(this.cacheLocation)();}this.httpTimeoutMs=e.httpTimeoutInSeconds?1e3*e.httpTimeoutInSeconds:1e4,this.cookieStorage=!1===e.legacySameSiteCookie?ka:_a,this.orgHintCookieName=(a=this.options.client_id,"auth0.".concat(a,".organization_hint")),this.isAuthenticatedCookieName=function(e){return "auth0.".concat(e,".is.authenticated")}(this.options.client_id),this.sessionCheckExpiryDays=e.sessionCheckExpiryDays||1;var u,l=e.useCookiesForTransactions?this.cookieStorage:Ia;this.scope=this.options.scope,this.transactionManager=new pa(l,this.options.client_id),this.nowProvider=this.options.nowProvider||Xc,this.cacheManager=new ha(c,c.allKeys?null:new Wa(c,this.options.client_id),this.nowProvider),this.domainUrl=(u=this.options.domain,/^https?:\/\//.test(u)?u:"https://".concat(u)),this.tokenIssuer=function(e,t){return e?e.startsWith("https://")?e:"https://".concat(e,"/"):"".concat(t,"/")}(this.options.issuer,this.domainUrl),this.defaultScope=ua("openid",void 0!==(null===(n=null===(t=this.options)||void 0===t?void 0:t.advancedOptions)||void 0===n?void 0:n.defaultScope)?this.options.advancedOptions.defaultScope:"openid profile email"),this.options.useRefreshTokens&&(this.scope=ua(this.scope,"offline_access")),"undefined"!=typeof window&&window.Worker&&this.options.useRefreshTokens&&"memory"===this.cacheLocation&&Pa()&&(this.worker=new Ra),this.customOptions=function(e){return e.advancedOptions,e.audience,e.auth0Client,e.authorizeTimeoutInSeconds,e.cacheLocation,e.cache,e.client_id,e.domain,e.issuer,e.leeway,e.max_age,e.nowProvider,e.redirect_uri,e.scope,e.useRefreshTokens,e.useRefreshTokensFallback,e.useCookiesForTransactions,e.useFormData,r(e,["advancedOptions","audience","auth0Client","authorizeTimeoutInSeconds","cacheLocation","cache","client_id","domain","issuer","leeway","max_age","nowProvider","redirect_uri","scope","useRefreshTokens","useRefreshTokensFallback","useCookiesForTransactions","useFormData"])}(e),this.useRefreshTokensFallback=!1!==this.options.useRefreshTokensFallback;}return e.prototype._url=function(e){var t=encodeURIComponent(btoa(JSON.stringify(this.options.auth0Client||Ac)));return "".concat(this.domainUrl).concat(e,"&auth0Client=").concat(t)},e.prototype._getParams=function(e,t,o,i,c){var a=this.options;a.useRefreshTokens,a.useCookiesForTransactions,a.useFormData,a.auth0Client,a.cacheLocation,a.advancedOptions,a.detailedResponse,a.nowProvider,a.authorizeTimeoutInSeconds,a.legacySameSiteCookie,a.sessionCheckExpiryDays,a.domain,a.leeway,a.httpTimeoutInSeconds;var s=r(a,["useRefreshTokens","useCookiesForTransactions","useFormData","auth0Client","cacheLocation","advancedOptions","detailedResponse","nowProvider","authorizeTimeoutInSeconds","legacySameSiteCookie","sessionCheckExpiryDays","domain","leeway","httpTimeoutInSeconds"]);return n(n(n({},s),e),{scope:ua(this.defaultScope,this.scope,e.scope),response_type:"code",response_mode:"query",state:t,nonce:o,redirect_uri:c||this.options.redirect_uri,code_challenge:i,code_challenge_method:"S256"})},e.prototype._authorizeUrl=function(e){return this._url("/authorize?".concat(Qc(e)))},e.prototype._verifyIdToken=function(e,t,n){return o(this,void 0,void 0,(function(){var r;return i(this,(function(o){switch(o.label){case 0:return [4,this.nowProvider()];case 1:return r=o.sent(),[2,ma({iss:this.tokenIssuer,aud:this.options.client_id,id_token:e,nonce:t,organizationId:n,leeway:this.options.leeway,max_age:this._parseNumber(this.options.max_age),now:r})]}}))}))},e.prototype._parseNumber=function(e){return "string"!=typeof e?e:parseInt(e,10)||void 0},e.prototype._processOrgIdHint=function(e){e?this.cookieStorage.save(this.orgHintCookieName,e,{daysUntilExpire:this.sessionCheckExpiryDays,cookieDomain:this.options.cookieDomain}):this.cookieStorage.remove(this.orgHintCookieName,{cookieDomain:this.options.cookieDomain});},e.prototype.buildAuthorizeUrl=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,o,c,a,s,u,l,f,d,h,p,y;return i(this,(function(i){switch(i.label){case 0:return t=e.redirect_uri,o=e.appState,c=r(e,["redirect_uri","appState"]),a=Bc(Mc()),s=Bc(Mc()),u=Mc(),[4,qc(u)];case 1:return l=i.sent(),f=ea(l),d=e.fragment?"#".concat(e.fragment):"",h=this._getParams(c,a,s,f,t),p=this._authorizeUrl(h),y=e.organization||this.options.organization,this.transactionManager.create(n({nonce:s,code_verifier:u,appState:o,scope:h.scope,audience:h.audience||"default",redirect_uri:h.redirect_uri,state:a},y&&{organizationId:y})),[2,p+d]}}))}))},e.prototype.loginWithPopup=function(e,t){return o(this,void 0,void 0,(function(){var o,c,a,s,u,l,f,d,h,p,y,v,m;return i(this,(function(i){switch(i.label){case 0:if(e=e||{},!(t=t||{}).popup&&(t.popup=function(e){var t=window.screenX+(window.innerWidth-400)/2,n=window.screenY+(window.innerHeight-600)/2;return window.open(e,"auth0:authorize:popup","left=".concat(t,",top=").concat(n,",width=").concat(400,",height=").concat(600,",resizable,scrollbars=yes,status=1"))}(""),!t.popup))throw new Error("Unable to open a popup for loginWithPopup - window.open returned `null`");return o=r(e,[]),c=Bc(Mc()),a=Bc(Mc()),s=Mc(),[4,qc(s)];case 1:return u=i.sent(),l=ea(u),f=this._getParams(o,c,a,l,this.options.redirect_uri||window.location.origin),d=this._authorizeUrl(n(n({},f),{response_mode:"web_message"})),t.popup.location.href=d,[4,Jc(n(n({},t),{timeoutInSeconds:t.timeoutInSeconds||this.options.authorizeTimeoutInSeconds||60}))];case 2:if(h=i.sent(),c!==h.state)throw new Error("Invalid state");return [4,aa({audience:f.audience,scope:f.scope,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:s,code:h.code,grant_type:"authorization_code",redirect_uri:f.redirect_uri,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData,timeout:this.httpTimeoutMs},this.worker)];case 3:return p=i.sent(),y=e.organization||this.options.organization,[4,this._verifyIdToken(p.id_token,a,y)];case 4:return v=i.sent(),m=n(n({},p),{decodedToken:v,scope:f.scope,audience:f.audience||"default",client_id:this.options.client_id}),[4,this.cacheManager.set(m)];case 5:return i.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays,cookieDomain:this.options.cookieDomain}),this._processOrgIdHint(v.claims.org_id),[2]}}))}))},e.prototype.getUser=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(o){switch(o.label){case 0:return t=e.audience||this.options.audience||"default",n=ua(this.defaultScope,this.scope,e.scope),[4,this.cacheManager.get(new la({client_id:this.options.client_id,audience:t,scope:n}))];case 1:return [2,(r=o.sent())&&r.decodedToken&&r.decodedToken.user]}}))}))},e.prototype.getIdTokenClaims=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(o){switch(o.label){case 0:return t=e.audience||this.options.audience||"default",n=ua(this.defaultScope,this.scope,e.scope),[4,this.cacheManager.get(new la({client_id:this.options.client_id,audience:t,scope:n}))];case 1:return [2,(r=o.sent())&&r.decodedToken&&r.decodedToken.claims]}}))}))},e.prototype.loginWithRedirect=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,o;return i(this,(function(i){switch(i.label){case 0:return t=e.redirectMethod,n=r(e,["redirectMethod"]),[4,this.buildAuthorizeUrl(n)];case 1:return o=i.sent(),window.location[t||"assign"](o),[2]}}))}))},e.prototype.handleRedirectCallback=function(e){return void 0===e&&(e=window.location.href),o(this,void 0,void 0,(function(){var t,r,o,a,s,u,l,f,d,h;return i(this,(function(i){switch(i.label){case 0:if(0===(t=e.split("?").slice(1)).length)throw new Error("There are no query params available for parsing.");if(r=function(e){e.indexOf("#")>-1&&(e=e.substr(0,e.indexOf("#")));var t=e.split("&"),n={};return t.forEach((function(e){var t=c(e.split("="),2),r=t[0],o=t[1];n[r]=decodeURIComponent(o);})),n.expires_in&&(n.expires_in=parseInt(n.expires_in)),n}(t.join("")),o=r.state,a=r.code,s=r.error,u=r.error_description,!(l=this.transactionManager.get()))throw new Error("Invalid state");if(this.transactionManager.remove(),s)throw new Kc(s,u,o,l.appState);if(!l.code_verifier||l.state&&l.state!==o)throw new Error("Invalid state");return f={audience:l.audience,scope:l.scope,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:l.code_verifier,grant_type:"authorization_code",code:a,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData,timeout:this.httpTimeoutMs},void 0!==l.redirect_uri&&(f.redirect_uri=l.redirect_uri),[4,aa(f,this.worker)];case 1:return d=i.sent(),[4,this._verifyIdToken(d.id_token,l.nonce,l.organizationId)];case 2:return h=i.sent(),[4,this.cacheManager.set(n(n(n(n({},d),{decodedToken:h,audience:l.audience,scope:l.scope}),d.scope?{oauthTokenScope:d.scope}:null),{client_id:this.options.client_id}))];case 3:return i.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays,cookieDomain:this.options.cookieDomain}),this._processOrgIdHint(h.claims.org_id),[2,{appState:l.appState}]}}))}))},e.prototype.checkSession=function(e){return o(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:if(!this.cookieStorage.get(this.isAuthenticatedCookieName)){if(!this.cookieStorage.get("auth0.is.authenticated"))return [2];this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays,cookieDomain:this.options.cookieDomain}),this.cookieStorage.remove("auth0.is.authenticated");}n.label=1;case 1:return n.trys.push([1,3,,4]),[4,this.getTokenSilently(e)];case 2:return n.sent(),[3,4];case 3:if(t=n.sent(),!Pc.includes(t.error))throw t;return [3,4];case 4:return [2]}}))}))},e.prototype.getTokenSilently=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,o,c,a,s=this;return i(this,(function(i){switch(i.label){case 0:return t=n(n({audience:this.options.audience,ignoreCache:!1},e),{scope:ua(this.defaultScope,this.scope,e.scope)}),o=t.ignoreCache,c=r(t,["ignoreCache"]),[4,(u=function(){return s._getTokenSilently(n({ignoreCache:o},c))},l="".concat(this.options.client_id,"::").concat(c.audience,"::").concat(c.scope),f=La[l],f||(f=u().finally((function(){delete La[l],f=null;})),La[l]=f),f)];case 1:return a=i.sent(),[2,e.detailedResponse?a:a.access_token]}var u,l,f;}))}))},e.prototype._getTokenSilently=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,c,a,s,u,l,f,d,h;return i(this,(function(p){switch(p.label){case 0:return t=e.ignoreCache,c=r(e,["ignoreCache"]),t?[3,2]:[4,this._getEntryFromCache({scope:c.scope,audience:c.audience||"default",client_id:this.options.client_id})];case 1:if(a=p.sent())return [2,a];p.label=2;case 2:return [4,(y=function(){return Za.acquireLock("auth0.lock.getTokenSilently",5e3)},v=10,void 0===v&&(v=3),o(void 0,void 0,void 0,(function(){var e;return i(this,(function(t){switch(t.label){case 0:e=0,t.label=1;case 1:return e<v?[4,y()]:[3,4];case 2:if(t.sent())return [2,!0];t.label=3;case 3:return e++,[3,1];case 4:return [2,!1]}}))})))];case 3:if(!p.sent())return [3,15];p.label=4;case 4:return p.trys.push([4,,12,14]),window.addEventListener("pagehide",this._releaseLockOnPageHide),t?[3,6]:[4,this._getEntryFromCache({scope:c.scope,audience:c.audience||"default",client_id:this.options.client_id})];case 5:if(a=p.sent())return [2,a];p.label=6;case 6:return this.options.useRefreshTokens?[4,this._getTokenUsingRefreshToken(c)]:[3,8];case 7:return u=p.sent(),[3,10];case 8:return [4,this._getTokenFromIFrame(c)];case 9:u=p.sent(),p.label=10;case 10:return s=u,[4,this.cacheManager.set(n({client_id:this.options.client_id},s))];case 11:return p.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays,cookieDomain:this.options.cookieDomain}),l=s.id_token,f=s.access_token,d=s.oauthTokenScope,h=s.expires_in,[2,n(n({id_token:l,access_token:f},d?{scope:d}:null),{expires_in:h})];case 12:return [4,Za.releaseLock("auth0.lock.getTokenSilently")];case 13:return p.sent(),window.removeEventListener("pagehide",this._releaseLockOnPageHide),[7];case 14:return [3,16];case 15:throw new Nc;case 16:return [2]}var y,v;}))}))},e.prototype.getTokenWithPopup=function(e,t){return void 0===e&&(e={}),void 0===t&&(t={}),o(this,void 0,void 0,(function(){return i(this,(function(r){switch(r.label){case 0:return e.audience=e.audience||this.options.audience,e.scope=ua(this.defaultScope,this.scope,e.scope),t=n(n({},Gc),t),[4,this.loginWithPopup(e,t)];case 1:return r.sent(),[4,this.cacheManager.get(new la({scope:e.scope,audience:e.audience||"default",client_id:this.options.client_id}))];case 2:return [2,r.sent().access_token]}}))}))},e.prototype.isAuthenticated=function(){return o(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return [4,this.getUser()];case 1:return [2,!!e.sent()]}}))}))},e.prototype.buildLogoutUrl=function(e){void 0===e&&(e={}),null!==e.client_id?e.client_id=e.client_id||this.options.client_id:delete e.client_id;var t=e.federated,n=r(e,["federated"]),o=t?"&federated":"";return this._url("/v2/logout?".concat(Qc(n)))+o},e.prototype.logout=function(e){var t=this;void 0===e&&(e={});var n=e.localOnly,o=r(e,["localOnly"]);if(n&&o.federated)throw new Error("It is invalid to set both the `federated` and `localOnly` options to `true`");var i=function(){if(t.cookieStorage.remove(t.orgHintCookieName,{cookieDomain:t.options.cookieDomain}),t.cookieStorage.remove(t.isAuthenticatedCookieName,{cookieDomain:t.options.cookieDomain}),!n){var e=t.buildLogoutUrl(o);window.location.assign(e);}};if(this.options.cache)return this.cacheManager.clear().then((function(){return i()}));this.cacheManager.clearSync(),i();},e.prototype._getTokenFromIFrame=function(e){return o(this,void 0,void 0,(function(){var t,o,c,a,s,u,l,f,d,h,p,y,v,m,b,g,w;return i(this,(function(i){switch(i.label){case 0:return t=Bc(Mc()),o=Bc(Mc()),c=Mc(),[4,qc(c)];case 1:a=i.sent(),s=ea(a),u=r(e,["detailedResponse"]),l=this._getParams(u,t,o,s,e.redirect_uri||this.options.redirect_uri||window.location.origin),(f=this.cookieStorage.get(this.orgHintCookieName))&&!l.organization&&(l.organization=f),d=this._authorizeUrl(n(n({},l),{prompt:"none",response_mode:"web_message"})),i.label=2;case 2:if(i.trys.push([2,6,,7]),window.crossOriginIsolated)throw new Fc("login_required","The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");return h=e.timeoutInSeconds||this.options.authorizeTimeoutInSeconds,[4,(S=d,k=this.domainUrl,_=h,void 0===_&&(_=60),new Promise((function(e,t){var n=window.document.createElement("iframe");n.setAttribute("width","0"),n.setAttribute("height","0"),n.style.display="none";var r,o=function(){window.document.body.contains(n)&&(window.document.body.removeChild(n),window.removeEventListener("message",r,!1));},i=setTimeout((function(){t(new Nc),o();}),1e3*_);r=function(n){if(n.origin==k&&n.data&&"authorization_response"===n.data.type){var c=n.source;c&&c.close(),n.data.response.error?t(Fc.fromPayload(n.data.response)):e(n.data.response),clearTimeout(i),window.removeEventListener("message",r,!1),setTimeout(o,2e3);}},window.addEventListener("message",r,!1),window.document.body.appendChild(n),n.setAttribute("src",S);})))];case 3:if(p=i.sent(),t!==p.state)throw new Error("Invalid state");return y=e.scope,v=e.audience,m=r(e,["scope","audience","redirect_uri","ignoreCache","timeoutInSeconds","detailedResponse"]),[4,aa(n(n(n({},this.customOptions),m),{scope:y,audience:v,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:c,code:p.code,grant_type:"authorization_code",redirect_uri:l.redirect_uri,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData,timeout:m.timeout||this.httpTimeoutMs}),this.worker)];case 4:return b=i.sent(),[4,this._verifyIdToken(b.id_token,o)];case 5:return g=i.sent(),this._processOrgIdHint(g.claims.org_id),[2,n(n({},b),{decodedToken:g,scope:l.scope,oauthTokenScope:b.scope,audience:l.audience||"default"})];case 6:throw "login_required"===(w=i.sent()).error&&this.logout({localOnly:!0}),w;case 7:return [2]}var S,k,_;}))}))},e.prototype._getTokenUsingRefreshToken=function(e){return o(this,void 0,void 0,(function(){var t,o,c,a,s,u,l,f,d;return i(this,(function(i){switch(i.label){case 0:return e.scope=ua(this.defaultScope,this.options.scope,e.scope),[4,this.cacheManager.get(new la({scope:e.scope,audience:e.audience||"default",client_id:this.options.client_id}))];case 1:return (t=i.sent())&&t.refresh_token||this.worker?[3,4]:this.useRefreshTokensFallback?[4,this._getTokenFromIFrame(e)]:[3,3];case 2:return [2,i.sent()];case 3:throw new Yc(e.audience||"default",e.scope);case 4:o=e.redirect_uri||this.options.redirect_uri||window.location.origin,a=e.scope,s=e.audience,u=r(e,["scope","audience","ignoreCache","timeoutInSeconds","detailedResponse"]),l="number"==typeof e.timeoutInSeconds?1e3*e.timeoutInSeconds:null,i.label=5;case 5:return i.trys.push([5,7,,10]),[4,aa(n(n(n(n(n({},this.customOptions),u),{audience:s,scope:a,baseUrl:this.domainUrl,client_id:this.options.client_id,grant_type:"refresh_token",refresh_token:t&&t.refresh_token,redirect_uri:o}),l&&{timeout:l}),{auth0Client:this.options.auth0Client,useFormData:this.options.useFormData,timeout:this.httpTimeoutMs}),this.worker)];case 6:return c=i.sent(),[3,10];case 7:return ((f=i.sent()).message.indexOf("Missing Refresh Token")>-1||f.message&&f.message.indexOf("invalid refresh token")>-1)&&this.useRefreshTokensFallback?[4,this._getTokenFromIFrame(e)]:[3,9];case 8:return [2,i.sent()];case 9:throw f;case 10:return [4,this._verifyIdToken(c.id_token)];case 11:return d=i.sent(),[2,n(n({},c),{decodedToken:d,scope:e.scope,oauthTokenScope:c.scope,audience:e.audience||"default"})]}}))}))},e.prototype._getEntryFromCache=function(e){var t=e.scope,r=e.audience,c=e.client_id;return o(this,void 0,void 0,(function(){var e,o,a,s,u;return i(this,(function(i){switch(i.label){case 0:return [4,this.cacheManager.get(new la({scope:t,audience:r,client_id:c}),60)];case 1:return (e=i.sent())&&e.access_token?(o=e.id_token,a=e.access_token,s=e.oauthTokenScope,u=e.expires_in,[2,n(n({id_token:o,access_token:a},s?{scope:s}:null),{expires_in:u})]):[2]}}))}))},e}();function Fa(e){return o(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return [4,(t=new Aa(e)).checkSession()];case 1:return n.sent(),[2,t]}}))}))}

    const config = {
      domain: "dev-0aufjnhcbdjlmt62.us.auth0.com",
      clientId: "AGELr7b4O2RhwUt40Oevyfkp3P568D6H"
    };

    let auth0Client;

    async function createClient() {
      auth0Client = await Fa({
        domain: config.domain,
        client_id: config.clientId
      });
    }

    async function loginWithPopup() {
      try {
        await createClient();
        await auth0Client.loginWithPopup();
        user.set(await auth0Client.getUser());
        const claims = await auth0Client.getIdTokenClaims();
        const id_token = await claims.__raw;
        jwt_token.set(id_token);
        console.log(id_token);
        isAuthenticated.set(true);
      } catch (e) {
        console.error(e);
      } 
    }

    function logout() {
      return auth0Client.logout();
    }

    const auth = {
      createClient,
      loginWithPopup,
      logout
    };

    /* src\App.svelte generated by Svelte v3.53.1 */
    const file = "src\\App.svelte";

    // (36:8) {:else}
    function create_else_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Log In";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-dismiss", "modal");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			set_style(button, "float", "right");
    			set_style(button, "margin-right", "10px");
    			set_style(button, "font-size", "18px");
    			add_location(button, file, 36, 10, 1363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", auth.loginWithPopup, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(36:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:8) {#if $isAuthenticated}
    function create_if_block_1(ctx) {
    	let div;
    	let input;
    	let input_placeholder_value;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Log Out";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$user*/ ctx[1].email);
    			attr_dev(input, "aria-label", "username");
    			attr_dev(input, "aria-describedby", "button-addon2");
    			input.readOnly = true;
    			add_location(input, file, 27, 10, 948);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn");
    			attr_dev(button, "data-dismiss", "modal");
    			set_style(button, "background-color", "#c73834");
    			set_style(button, "color", "#fff");
    			set_style(button, "font-size", "18px");
    			add_location(button, file, 28, 10, 1092);
    			attr_dev(div, "class", "input-group");
    			set_style(div, "width", "350px");
    			set_style(div, "float", "right");
    			set_style(div, "margin-right", "10px");
    			add_location(div, file, 26, 8, 855);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, t0);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", auth.logout, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$user*/ 2 && input_placeholder_value !== (input_placeholder_value = /*$user*/ ctx[1].email)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(26:8) {#if $isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (71:8) {#if $isAuthenticated}
    function create_if_block(ctx) {
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let t7;
    	let li4;
    	let a4;
    	let t9;
    	let li5;
    	let a5;
    	let t11;
    	let li6;
    	let a6;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Firewall-Rules";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Contexts";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Network-Objects";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Network-Group-Objects";
    			t7 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Host-Objects";
    			t9 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Host-Group-Objects";
    			t11 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Service-Group-Objects";
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "aria-current", "page");
    			attr_dev(a0, "href", "#/firewall-rules");
    			add_location(a0, file, 72, 12, 2429);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file, 71, 10, 2394);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "#/contexts");
    			add_location(a1, file, 77, 12, 2605);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file, 76, 10, 2570);
    			attr_dev(a2, "class", "nav-link");
    			attr_dev(a2, "href", "#/network-Objects");
    			add_location(a2, file, 81, 12, 2721);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file, 80, 10, 2686);
    			attr_dev(a3, "class", "nav-link");
    			attr_dev(a3, "href", "#/network-Group-Objects");
    			add_location(a3, file, 84, 12, 2849);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file, 83, 10, 2814);
    			attr_dev(a4, "class", "nav-link");
    			attr_dev(a4, "href", "#/host-Objects");
    			add_location(a4, file, 89, 12, 3019);
    			attr_dev(li4, "class", "nav-item");
    			add_location(li4, file, 88, 10, 2984);
    			attr_dev(a5, "class", "nav-link");
    			attr_dev(a5, "href", "#/host-Group-Objects");
    			add_location(a5, file, 92, 12, 3141);
    			attr_dev(li5, "class", "nav-item");
    			add_location(li5, file, 91, 10, 3106);
    			attr_dev(a6, "class", "nav-link");
    			attr_dev(a6, "href", "#/service-Group-Objects");
    			add_location(a6, file, 97, 12, 3305);
    			attr_dev(li6, "class", "nav-item");
    			add_location(li6, file, 96, 10, 3270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, li2, anchor);
    			append_dev(li2, a2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, li3, anchor);
    			append_dev(li3, a3);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, li4, anchor);
    			append_dev(li4, a4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, li5, anchor);
    			append_dev(li5, a5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, li6, anchor);
    			append_dev(li6, a6);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(li2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(li3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(li4);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(li5);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(li6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(71:8) {#if $isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div5;
    	let div4;
    	let div3;
    	let div0;
    	let a0;
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
    	let a1;
    	let t6;
    	let t7;
    	let li1;
    	let a2;
    	let t9;
    	let div7;
    	let router;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*$isAuthenticated*/ ctx[0]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*$isAuthenticated*/ ctx[0] && create_if_block(ctx);
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			center = element("center");
    			center.textContent = "Firewall Documentation";
    			t2 = space();
    			div2 = element("div");
    			if_block0.c();
    			t3 = space();
    			div8 = element("div");
    			nav = element("nav");
    			button = element("button");
    			span = element("span");
    			t4 = space();
    			div6 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Home";
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Use-Cases";
    			t9 = space();
    			div7 = element("div");
    			create_component(router.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "https://www.buelach.ch/fileadmin/cd/Images/logo_stadtbuelach.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Stadt Bülach Logo");
    			set_style(img, "height", "50px");
    			set_style(img, "width", "231px");
    			add_location(img, file, 12, 11, 399);
    			attr_dev(a0, "href", "#/home");
    			add_location(a0, file, 11, 8, 370);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file, 10, 6, 343);
    			add_location(center, file, 21, 10, 693);
    			set_style(h1, "font-weight", "bold");
    			add_location(h1, file, 20, 8, 650);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file, 19, 6, 623);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "margin-top", "6px");
    			add_location(div2, file, 24, 6, 771);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file, 9, 4, 318);
    			set_style(div4, "padding-top", "15px");
    			set_style(div4, "padding-bottom", "15px");
    			add_location(div4, file, 8, 2, 258);
    			attr_dev(div5, "class", "container-fluid");
    			set_style(div5, "background-color", "#ececee");
    			add_location(div5, file, 7, 0, 190);
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file, 63, 6, 2101);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbarNav");
    			attr_dev(button, "aria-controls", "navbarNav");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file, 54, 4, 1860);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "#/home");
    			add_location(a1, file, 68, 10, 2293);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file, 67, 8, 2260);
    			attr_dev(a2, "class", "nav-link");
    			attr_dev(a2, "href", "#/use-cases");
    			add_location(a2, file, 103, 10, 3486);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file, 102, 8, 3453);
    			attr_dev(ul, "class", "navbar-nav mx-auto");
    			add_location(ul, file, 66, 6, 2219);
    			attr_dev(div6, "class", "collapse navbar-collapse");
    			attr_dev(div6, "id", "navbarNav");
    			add_location(div6, file, 65, 4, 2158);
    			attr_dev(nav, "class", "navbar navbar-expand-lg");
    			set_style(nav, "background-color", "#969FAA");
    			set_style(nav, "color", "black");
    			set_style(nav, "height", "38pt");
    			add_location(nav, file, 50, 2, 1740);
    			attr_dev(div7, "class", "container");
    			add_location(div7, file, 109, 2, 3594);
    			attr_dev(div8, "id", "app");
    			add_location(div8, file, 49, 0, 1722);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, h1);
    			append_dev(h1, center);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if_block0.m(div2, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, nav);
    			append_dev(nav, button);
    			append_dev(button, span);
    			append_dev(nav, t4);
    			append_dev(nav, div6);
    			append_dev(div6, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t6);
    			if (if_block1) if_block1.m(ul, null);
    			append_dev(ul, t7);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(div8, t9);
    			append_dev(div8, div7);
    			mount_component(router, div7, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			}

    			if (/*$isAuthenticated*/ ctx[0]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(ul, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
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
    			if_block0.d();
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div8);
    			if (if_block1) if_block1.d();
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
    	let $isAuthenticated;
    	let $user;
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(0, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		routes,
    		isAuthenticated,
    		user,
    		auth,
    		$isAuthenticated,
    		$user
    	});

    	return [$isAuthenticated, $user];
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
