/**
 * dripStore.js
 * 
 * Manages the application state for the Drought Intelligence Platform.
 * Uses REST API for data persistence and an EventTarget for reactivity.
 */

const API_Base = 'http://localhost:4000/api';

class DripStore extends EventTarget {
    constructor() {
        super();
        this.state = {
            villages: [],
            waterPoints: [],
            livestock: [],
            ngoActivities: [],
            alerts: [],
            currentUser: null,
            loading: false,
            error: null
        };
        // Initial Fetch
        this.fetchAll();
    }

    async fetchAll() {
        this.state.loading = true;
        this.dispatchEvent(new Event('change'));

        try {
            const [villages, waterPoints, livestock, ngo, alerts] = await Promise.all([
                fetch(`${API_Base}/villages`).then(res => res.json()),
                fetch(`${API_Base}/water-points`).then(res => res.json()),
                fetch(`${API_Base}/livestock`).then(res => res.json()),
                fetch(`${API_Base}/ngo-activities`).then(res => res.json()),
                fetch(`${API_Base}/alerts`).then(res => res.json())
            ]);

            this.state.villages = villages;
            this.state.waterPoints = waterPoints;
            this.state.livestock = livestock;
            this.state.ngoActivities = ngo;
            this.state.alerts = alerts;
            this.state.loading = false;
        } catch (err) {
            console.error("Failed to fetch data:", err);
            this.state.error = err.message;
            this.state.loading = false;
        }
        this.dispatchEvent(new Event('change'));
    }

    getState() {
        return this.state;
    }

    // --- Auth ---
    async login(username, password) {
        try {
            const res = await fetch(`${API_Base}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const user = await res.json();
                this.state.currentUser = user;
                this.dispatchEvent(new Event('change'));
                return true;
            }
            return false;
        } catch (err) {
            console.error("Login failed", err);
            return false;
        }
    }

    logout() {
        this.state.currentUser = null;
        this.dispatchEvent(new Event('change'));
    }

    // --- Villages ---
    getVillages() { return this.state.villages; }
    getVillageById(id) { return this.state.villages.find(v => v._id === id || v.id === id); }

    // --- Water Points ---
    getWaterPoints() { return this.state.waterPoints; }

    async updateWaterPointStatus(id, status, isFunctional) {
        try {
            const res = await fetch(`${API_Base}/water-points/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, isFunctional })
            });

            if (res.ok) {
                const updated = await res.json();
                this.state.waterPoints = this.state.waterPoints.map(wp => wp._id === id ? updated : wp);
                this.dispatchEvent(new Event('change'));

                // Refresh alerts if needed (since backend might create one)
                if (!isFunctional) this.fetchAlerts();
            }
        } catch (err) {
            console.error("Failed to update water point", err);
        }
    }

    // --- Livestock ---
    getLivestock() { return this.state.livestock; }

    // --- NGOs ---
    getNGOActivities() { return this.state.ngoActivities; }

    async addNGOActivity(activity) {
        try {
            const res = await fetch(`${API_Base}/ngo-activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activity)
            });

            if (res.ok) {
                const newActivity = await res.json();
                this.state.ngoActivities.push(newActivity);
                this.dispatchEvent(new Event('change'));
            }
        } catch (err) {
            console.error("Failed to add activity", err);
        }
    }

    // --- Alerts ---
    getActiveAlerts() {
        return this.state.alerts.filter(a => !a.isResolved);
    }

    getAlerts() { return this.state.alerts; }

    async fetchAlerts() {
        try {
            const alerts = await fetch(`${API_Base}/alerts`).then(res => res.json());
            this.state.alerts = alerts;
            this.dispatchEvent(new Event('change'));
        } catch (err) { console.error(err); }
    }

    async resolveAlert(id) {
        try {
            const res = await fetch(`${API_Base}/alerts/${id}/resolve`, { method: 'PUT' });
            if (res.ok) {
                this.state.alerts = this.state.alerts.map(a => a._id === id ? { ...a, isResolved: true } : a);
                this.dispatchEvent(new Event('change'));
            }
        } catch (err) {
            console.error("Failed to resolve alert", err);
        }
    }
}

export const dripStore = new DripStore();
