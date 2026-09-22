/* ==================================================
   GYM PRO - DASHBOARD.JS
   HTML + CSS + JavaScript + LocalStorage
================================================== */


/* ==================================================
   LOGIN PROTECTION
================================================== */

const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "index.html";
}


/* ==================================================
   DATA
================================================== */

let members = JSON.parse(
    localStorage.getItem("members") || "[]"
);

let payments = JSON.parse(
    localStorage.getItem("payments") || "[]"
);

if (!Array.isArray(members)) {
    members = [];
}

if (!Array.isArray(payments)) {
    payments = [];
}


/* ==================================================
   ELEMENTS
================================================== */

const totalMembers =
    document.getElementById("totalMembers");

const activeMembers =
    document.getElementById("activeMembers");

const expiredMembers =
    document.getElementById("expiredMembers");

const totalPayments =
    document.getElementById("totalPayments");

const monthlyRevenue =
    document.getElementById("monthlyRevenue");

const membersTable =
    document.getElementById("membersTable");

const paymentsTable =
    document.getElementById("paymentsTable");

const recentPayments =
    document.getElementById("recentPayments");

const memberModal =
    document.getElementById("memberModal");

const paymentModal =
    document.getElementById("paymentModal");

const profileModal =
    document.getElementById("profileModal");

const memberForm =
    document.getElementById("memberForm");

const paymentForm =
    document.getElementById("paymentForm");

const canvas =
    document.getElementById("revenueChart");

const ctx =
    canvas ? canvas.getContext("2d") : null;

const chartYear =
    document.getElementById("chartYear");


/* ==================================================
   SAVE DATA
================================================== */

function saveMembers() {

    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );

}


function savePayments() {

    localStorage.setItem(
        "payments",
        JSON.stringify(payments)
    );

}


/* ==================================================
   MONEY
================================================== */

function formatMoney(value) {

    return Number(value || 0).toLocaleString(
        "fr-FR"
    ) + " DH";

}


/* ==================================================
   DATE
================================================== */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const d = new Date(
        date + "T00:00:00"
    );

    if (isNaN(d.getTime())) {
        return "-";
    }

    return d.toLocaleDateString("fr-FR");

}


function getTodayString() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text ?? "");

    return div.innerHTML;

}


/* ==================================================
   TOAST
================================================== */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    if (!toast) return;

    if (toastMessage) {
        toastMessage.textContent = message;
    } else {
        toast.textContent = message;
    }

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ==================================================
   LOGOUT
================================================== */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "isLoggedIn"
            );

            window.location.href =
                "index.html";

        }
    );

}


/* ==================================================
   MOBILE MENU
================================================== */

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const sidebar =
    document.getElementById("sidebar");

if (mobileMenuBtn && sidebar) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("open");

        }
    );

}


/* ==================================================
   NAVIGATION
================================================== */

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".nav-link")
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });

                this.classList.add("active");

                if (sidebar) {
                    sidebar.classList.remove("open");
                }

            }
        );

    });


/* ==================================================
   MEMBER MODAL
================================================== */

function openMemberModal(member = null) {

    if (!memberModal || !memberForm) {
        return;
    }

    memberModal.classList.add("show");

    if (member) {

        document.getElementById(
            "memberModalTitle"
        ).textContent =
            "Modifier le membre";

        document.getElementById(
            "memberId"
        ).value =
            member.id;

        document.getElementById(
            "memberName"
        ).value =
            member.name || "";

        document.getElementById(
            "memberPhone"
        ).value =
            member.phone || "";

        document.getElementById(
            "memberPlan"
        ).value =
            member.plan || "";

        document.getElementById(
            "memberPrice"
        ).value =
            member.price || "";

        document.getElementById(
            "memberStartDate"
        ).value =
            member.startDate || getTodayString();

    } else {

        memberForm.reset();

        document.getElementById(
            "memberId"
        ).value = "";

        document.getElementById(
            "memberModalTitle"
        ).textContent =
            "Ajouter un membre";

        document.getElementById(
            "memberStartDate"
        ).value =
            getTodayString();

    }

}


function closeMemberModal() {

    if (!memberModal) return;

    memberModal.classList.remove("show");

}


const addMemberBtn =
    document.getElementById("addMemberBtn");

if (addMemberBtn) {

    addMemberBtn.addEventListener(
        "click",
        () => openMemberModal()
    );

}


const closeMemberModalBtn =
    document.getElementById("closeMemberModal");

if (closeMemberModalBtn) {

    closeMemberModalBtn.addEventListener(
        "click",
        closeMemberModal
    );

}


const cancelMember =
    document.getElementById("cancelMember");

if (cancelMember) {

    cancelMember.addEventListener(
        "click",
        closeMemberModal
    );

}


/* ==================================================
   CALCUL END DATE
================================================== */

function calculateEndDate(
    startDate,
    plan
) {

    if (!startDate) {
        return "";
    }

    const date =
        new Date(
            startDate + "T00:00:00"
        );

    if (isNaN(date.getTime())) {
        return "";
    }

    if (plan === "Mensuel") {

        date.setMonth(
            date.getMonth() + 1
        );

    }

    if (plan === "Trimestriel") {

        date.setMonth(
            date.getMonth() + 3
        );

    }

    if (plan === "Annuel") {

        date.setFullYear(
            date.getFullYear() + 1
        );

    }

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ==================================================
   MEMBER FORM
================================================== */

if (memberForm) {

    memberForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const id =
                document.getElementById(
                    "memberId"
                ).value;

            const name =
                document.getElementById(
                    "memberName"
                ).value.trim();

            const phone =
                document.getElementById(
                    "memberPhone"
                ).value.trim();

            const plan =
                document.getElementById(
                    "memberPlan"
                ).value;

            const price =
                Number(
                    document.getElementById(
                        "memberPrice"
                    ).value
                );

            const startDate =
                document.getElementById(
                    "memberStartDate"
                ).value;


            if (name.length < 2) {

                showToast(
                    "Nom invalide."
                );

                return;

            }


            if (!phone) {

                showToast(
                    "Téléphone obligatoire."
                );

                return;

            }


            if (!plan) {

                showToast(
                    "Choisissez un abonnement."
                );

                return;

            }


            if (price <= 0) {

                showToast(
                    "Prix invalide."
                );

                return;

            }


            if (!startDate) {

                showToast(
                    "Date de début obligatoire."
                );

                return;

            }


            const endDate =
                calculateEndDate(
                    startDate,
                    plan
                );


            if (id) {

                const member =
                    members.find(
                        item =>
                            String(item.id) ===
                            String(id)
                    );

                if (member) {

                    member.name =
                        name;

                    member.phone =
                        phone;

                    member.plan =
                        plan;

                    member.price =
                        price;

                    member.startDate =
                        startDate;

                    member.endDate =
                        endDate;

                    showToast(
                        "Membre modifié."
                    );

                }

            } else {

                const member = {

                    id: Date.now(),

                    name: name,

                    phone: phone,

                    plan: plan,

                    price: price,

                    startDate: startDate,

                    endDate: endDate

                };

                members.push(member);

                showToast(
                    "Membre ajouté."
                );

            }


            saveMembers();

            closeMemberModal();

            displayMembers();

            updateAnalytics();

            loadPaymentMembers();

            updateExpirationAlert();

        }
    );

}


/* ==================================================
   MEMBER STATUS
================================================== */

function getMemberStatus(member) {

    if (!member.endDate) {

        return {
            text: "Inconnu",
            className: "status-warning"
        };

    }

    const today =
        new Date(
            getTodayString() +
            "T00:00:00"
        );

    const end =
        new Date(
            member.endDate +
            "T00:00:00"
        );

    const difference =
        Math.ceil(
            (
                end - today
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (difference < 0) {

        return {
            text: "Expiré",
            className: "status-expired"
        };

    }


    if (difference <= 7) {

        return {
            text:
                difference === 0
                    ? "Expire aujourd'hui"
                    : `Expire dans ${difference} j`,
            className: "status-warning"
        };

    }


    return {
        text: "Actif",
        className: "status-active"
    };

}


/* ==================================================
   DISPLAY MEMBERS
================================================== */

function displayMembers() {

    if (!membersTable) return;


    const searchInput =
        document.getElementById(
            "searchMember"
        );

    const filterInput =
        document.getElementById(
            "filterPlan"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const planFilter =
        filterInput
            ? filterInput.value
            : "all";


    const filtered =
        members.filter(member => {

            const name =
                String(
                    member.name || ""
                ).toLowerCase();

            const phone =
                String(
                    member.phone || ""
                ).toLowerCase();

            const plan =
                String(
                    member.plan || ""
                ).toLowerCase();


            const matchesSearch =
                name.includes(search) ||
                phone.includes(search) ||
                plan.includes(search);


            const matchesPlan =
                !planFilter ||
                planFilter === "all" ||
                planFilter === "Tous" ||
                member.plan === planFilter;


            return (
                matchesSearch &&
                matchesPlan
            );

        });


    membersTable.innerHTML = "";


    if (filtered.length === 0) {

        membersTable.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    Aucun membre trouvé.
                </td>
            </tr>
        `;

        return;

    }


    filtered.forEach(member => {

        const status =
            getMemberStatus(member);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(member.name)}
                </strong>
            </td>

            <td>
                ${escapeHTML(member.phone)}
            </td>

            <td>
                ${escapeHTML(member.plan)}
            </td>

            <td>
                ${formatMoney(member.price)}
            </td>

            <td>
                ${formatDate(member.startDate)}
            </td>

            <td>
                ${formatDate(member.endDate)}
            </td>

            <td>
                <span class="${status.className}">
                    ${escapeHTML(status.text)}
                </span>
            </td>

            <td>

                <button
                    class="action-btn"
                    title="Profil"
                    onclick="openProfile('${member.id}')"
                >
                    👤
                </button>

                <button
                    class="action-btn"
                    title="Modifier"
                    onclick="editMember('${member.id}')"
                >
                    ✏️
                </button>

                <button
                    class="action-btn"
                    title="Renouveler"
                    onclick="renewMember('${member.id}')"
                >
                    🔄
                </button>

                <button
                    class="action-btn"
                    title="Supprimer"
                    onclick="deleteMember('${member.id}')"
                >
                    🗑️
                </button>

            </td>

        `;


        membersTable.appendChild(row);

    });

}


/* ==================================================
   EDIT MEMBER
================================================== */

function editMember(id) {

    const member =
        members.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (member) {

        openMemberModal(member);

    }

}


/* ==================================================
   DELETE MEMBER
================================================== */

function deleteMember(id) {

    const member =
        members.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!member) return;


    const confirmed =
        confirm(
            `Supprimer ${member.name} ?`
        );


    if (!confirmed) return;


    members =
        members.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    payments =
        payments.filter(
            payment =>
                String(payment.memberId) !==
                String(id)
        );


    saveMembers();

    savePayments();

    displayMembers();

    displayPayments();

    displayRecentPayments();

    updateAnalytics();

    updatePaymentStats();

    loadPaymentMembers();

    updateExpirationAlert();

    updateRevenueChart();


    showToast(
        "Membre supprimé."
    );

}


/* ==================================================
   RENEW MEMBER
================================================== */

function renewMember(id) {

    const member =
        members.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!member) return;


    const today =
        getTodayString();


    let currentEnd =
        member.endDate || today;


    if (currentEnd < today) {
        currentEnd = today;
    }


    member.startDate =
        currentEnd;

    member.endDate =
        calculateEndDate(
            currentEnd,
            member.plan
        );


    saveMembers();

    displayMembers();

    updateAnalytics();

    updateExpirationAlert();


    showToast(
        "Abonnement renouvelé."
    );

}


/* ==================================================
   SEARCH + FILTER
================================================== */

const searchMember =
    document.getElementById(
        "searchMember"
    );

if (searchMember) {

    searchMember.addEventListener(
        "input",
        displayMembers
    );

}


const filterPlan =
    document.getElementById(
        "filterPlan"
    );

if (filterPlan) {

    filterPlan.addEventListener(
        "change",
        displayMembers
    );

}


/* ==================================================
   PAYMENT MODAL
================================================== */

function openPaymentModal(
    selectedMemberId = null
) {

    if (members.length === 0) {

        showToast(
            "Ajoutez d'abord un membre."
        );

        return;

    }


    if (!paymentModal || !paymentForm) {
        return;
    }


    paymentModal.classList.add(
        "show"
    );


    paymentForm.reset();


    const paymentDate =
        document.getElementById(
            "paymentDate"
        );

    if (paymentDate) {

        paymentDate.value =
            getTodayString();

    }


    loadPaymentMembers(
        selectedMemberId
    );

}


function closePaymentModal() {

    if (!paymentModal) return;

    paymentModal.classList.remove(
        "show"
    );

}


const addPaymentBtn =
    document.getElementById(
        "addPaymentBtn"
    );

if (addPaymentBtn) {

    addPaymentBtn.addEventListener(
        "click",
        () => openPaymentModal()
    );

}


const closePaymentModalBtn =
    document.getElementById(
        "closePaymentModal"
    );

if (closePaymentModalBtn) {

    closePaymentModalBtn.addEventListener(
        "click",
        closePaymentModal
    );

}


const cancelPayment =
    document.getElementById(
        "cancelPayment"
    );

if (cancelPayment) {

    cancelPayment.addEventListener(
        "click",
        closePaymentModal
    );

}


/* ==================================================
   LOAD PAYMENT MEMBERS
================================================== */

function loadPaymentMembers(
    selectedMemberId = null
) {

    const select =
        document.getElementById(
            "paymentMember"
        );

    if (!select) return;


    select.innerHTML = `
        <option value="">
            Choisir un membre
        </option>
    `;


    members.forEach(member => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            member.id;

        option.textContent =
            `${member.name} - ${member.plan}`;


        if (
            selectedMemberId !== null &&
            String(member.id) ===
            String(selectedMemberId)
        ) {

            option.selected =
                true;

        }


        select.appendChild(option);

    });

}


/* ==================================================
   AUTO PRICE FROM MEMBER
================================================== */

const paymentMember =
    document.getElementById(
        "paymentMember"
    );

if (paymentMember) {

    paymentMember.addEventListener(
        "change",
        function () {

            const member =
                members.find(
                    item =>
                        String(item.id) ===
                        String(this.value)
                );

            const amount =
                document.getElementById(
                    "paymentAmount"
                );

            if (
                member &&
                amount &&
                !amount.value
            ) {

                amount.value =
                    member.price;

            }

        }
    );

}


/* ==================================================
   PAYMENT FORM
================================================== */

if (paymentForm) {

    paymentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const memberId =
                document.getElementById(
                    "paymentMember"
                ).value;


            const amount =
                Number(
                    document.getElementById(
                        "paymentAmount"
                    ).value
                );


            const date =
                document.getElementById(
                    "paymentDate"
                ).value;


            const method =
                document.getElementById(
                    "paymentMethod"
                ).value;


            const member =
                members.find(
                    item =>
                        String(item.id) ===
                        String(memberId)
                );


            if (!member) {

                showToast(
                    "Choisissez un membre."
                );

                return;

            }


            if (amount <= 0) {

                showToast(
                    "Montant invalide."
                );

                return;

            }


            if (!date) {

                showToast(
                    "Date obligatoire."
                );

                return;

            }


            if (!method) {

                showToast(
                    "Choisissez un mode de paiement."
                );

                return;

            }


            const payment = {

                id: Date.now(),

                memberId:
                    member.id,

                memberName:
                    member.name,

                amount:

                    amount,

                date:

                    date,

                method:

                    method

            };


            payments.push(payment);

            savePayments();


            closePaymentModal();


            displayPayments();

            displayRecentPayments();

            updatePaymentStats();

            updateAnalytics();

            updateRevenueChart();


            showToast(
                "Paiement enregistré."
            );

        }
    );

}


/* ==================================================
   DISPLAY PAYMENTS
================================================== */

function displayPayments() {

    if (!paymentsTable) return;


    paymentsTable.innerHTML = "";


    if (payments.length === 0) {

        paymentsTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    Aucun paiement.
                </td>
            </tr>
        `;

        return;

    }


    const sorted =
        [...payments].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    sorted.forEach(payment => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(payment.memberName)}
                </strong>
            </td>

            <td>
                ${formatMoney(payment.amount)}
            </td>

            <td>
                ${formatDate(payment.date)}
            </td>

            <td>
                ${escapeHTML(payment.method)}
            </td>

            <td>

                <button
                    class="action-btn"
                    title="Supprimer"
                    onclick="deletePayment('${payment.id}')"
                >
                    🗑️
                </button>

            </td>

        `;


        paymentsTable.appendChild(row);

    });

}


/* ==================================================
   DELETE PAYMENT
================================================== */

function deletePayment(id) {

    const confirmed =
        confirm(
            "Supprimer ce paiement ?"
        );


    if (!confirmed) return;


    payments =
        payments.filter(
            payment =>
                String(payment.id) !==
                String(id)
        );


    savePayments();


    displayPayments();

    displayRecentPayments();

    updatePaymentStats();

    updateAnalytics();

    updateRevenueChart();


    showToast(
        "Paiement supprimé."
    );

}


/* ==================================================
   PAYMENT STATS
================================================== */

function updatePaymentStats() {

    const total =
        payments.reduce(
            (
                sum,
                payment
            ) =>
                sum +
                Number(
                    payment.amount || 0
                ),
            0
        );


    const paymentCount =
        document.getElementById(
            "paymentCount"
        );

    const paymentTotal =
        document.getElementById(
            "paymentTotal"
        );


    if (paymentCount) {

        paymentCount.textContent =
            payments.length;

    }


    if (paymentTotal) {

        paymentTotal.textContent =
            formatMoney(total);

    }

}


/* ==================================================
   RECENT PAYMENTS
================================================== */

function displayRecentPayments() {

    if (!recentPayments) return;


    recentPayments.innerHTML = "";


    if (payments.length === 0) {

        recentPayments.innerHTML = `
            <p style="color:#94a3b8;">
                Aucun paiement récent.
            </p>
        `;

        return;

    }


    const sorted =
        [...payments].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    sorted
        .slice(0, 5)
        .forEach(payment => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "recent-item";


            item.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            payment.memberName
                        )}
                    </strong>

                    <small>
                        ${formatDate(
                            payment.date
                        )}
                        ·
                        ${escapeHTML(
                            payment.method
                        )}
                    </small>

                </div>

                <strong>
                    ${formatMoney(
                        payment.amount
                    )}
                </strong>

            `;


            recentPayments.appendChild(item);

        });

}


/* ==================================================
   ANALYTICS
================================================== */

function updateAnalytics() {

    const today =
        new Date(
            getTodayString() +
            "T00:00:00"
        );


    let active = 0;

    let expired = 0;


    members.forEach(member => {

        if (!member.endDate) {

            expired++;

            return;

        }


        const end =
            new Date(
                member.endDate +
                "T00:00:00"
            );


        if (end >= today) {

            active++;

        } else {

            expired++;

        }

    });


    const currentMonth =
        today.getMonth();

    const currentYear =
        today.getFullYear();


    const monthRevenue =
        payments.reduce(
            (
                total,
                payment
            ) => {

                const date =
                    new Date(
                        payment.date +
                        "T00:00:00"
                    );


                if (
                    date.getMonth() ===
                    currentMonth &&
                    date.getFullYear() ===
                    currentYear
                ) {

                    return (
                        total +
                        Number(
                            payment.amount || 0
                        )
                    );

                }


                return total;

            },
            0
        );


    if (totalMembers) {

        totalMembers.textContent =
            members.length;

    }


    if (activeMembers) {

        activeMembers.textContent =
            active;

    }


    if (expiredMembers) {

        expiredMembers.textContent =
            expired;

    }


    if (totalPayments) {

        totalPayments.textContent =
            payments.length;

    }


    if (monthlyRevenue) {

        monthlyRevenue.textContent =
            formatMoney(
                monthRevenue
            );

    }

}


/* ==================================================
   EXPIRATION ALERT
================================================== */

function updateExpirationAlert() {

    const alertBox =
        document.getElementById(
            "expirationAlert"
        );

    const alertText =
        document.getElementById(
            "expirationAlertText"
        );


    if (!alertBox || !alertText) {
        return;
    }


    const today =
        new Date(
            getTodayString() +
            "T00:00:00"
        );


    const expiring =
        members.filter(
            member => {

                if (!member.endDate) {
                    return false;
                }


                const end =
                    new Date(
                        member.endDate +
                        "T00:00:00"
                    );


                const days =
                    Math.ceil(
                        (
                            end - today
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );


                return (
                    days >= 0 &&
                    days <= 7
                );

            }
        );


    if (expiring.length === 0) {

        alertBox.style.display =
            "none";

        return;

    }


    alertBox.style.display =
        "flex";


    alertText.textContent =
        `${expiring.length} abonnement(s) expire(nt) dans les 7 prochains jours.`;

}


/* ==================================================
   CHART YEARS
================================================== */

function setupChartYears() {

    if (!chartYear) return;


    const currentYear =
        new Date().getFullYear();


    chartYear.innerHTML = "";


    for (
        let year = currentYear;
        year >= currentYear - 4;
        year--
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            year;


        option.textContent =
            year;


        chartYear.appendChild(option);

    }


    chartYear.value =
        currentYear;

}


/* ==================================================
   REVENUE CHART
================================================== */

function updateRevenueChart() {

    if (!canvas || !ctx || !chartYear) {
        return;
    }


    const year =
        Number(
            chartYear.value
        );


    const totals =
        Array(12).fill(0);


    payments.forEach(payment => {

        if (!payment.date) {
            return;
        }


        const date =
            new Date(
                payment.date +
                "T00:00:00"
            );


        if (
            date.getFullYear() ===
            year
        ) {

            totals[
                date.getMonth()
            ] +=
                Number(
                    payment.amount || 0
                );

        }

    });


    const hasData =
        totals.some(
            value =>
                value > 0
        );


    const chartEmpty =
        document.getElementById(
            "chartEmpty"
        );


    if (chartEmpty) {

        chartEmpty.style.display =
            hasData
                ? "none"
                : "flex";

    }


    const rect =
        canvas.getBoundingClientRect();


    const width =
        rect.width || 600;


    const height =
        rect.height || 330;


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        width * dpr;


    canvas.height =
        height * dpr;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const paddingLeft = 65;

    const paddingRight = 25;

    const paddingTop = 30;

    const paddingBottom = 45;


    const chartWidth =
        width -
        paddingLeft -
        paddingRight;


    const chartHeight =
        height -
        paddingTop -
        paddingBottom;


    const maxValue =
        Math.max(
            ...totals,
            100
        );


    const isLight =
        document.body.classList.contains(
            "light-mode"
        );


    ctx.strokeStyle =
        isLight
            ? "#e5e7eb"
            : "#334155";


    ctx.fillStyle =
        isLight
            ? "#64748b"
            : "#94a3b8";


    ctx.font =
        "11px Arial";


    /* GRID */

    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            paddingTop +
            chartHeight *
            i /
            4;


        ctx.beginPath();

        ctx.moveTo(
            paddingLeft,
            y
        );

        ctx.lineTo(
            width -
            paddingRight,
            y
        );

        ctx.stroke();


        const value =
            maxValue -
            maxValue *
            i /
            4;


        ctx.fillText(
            formatMoney(value),
            5,
            y + 4
        );

    }


    const months = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Déc"
    ];


    const points = [];


    totals.forEach(
        (value, index) => {

            const x =
                paddingLeft +
                index /
                11 *
                chartWidth;


            const y =
                paddingTop +
                chartHeight -
                (
                    value /
                    maxValue
                ) *
                chartHeight;


            points.push({
                x: x,
                y: y,
                value: value
            });

        }
    );


    if (hasData) {

        ctx.beginPath();


        points.forEach(
            (point, index) => {

                if (index === 0) {

                    ctx.moveTo(
                        point.x,
                        point.y
                    );

                } else {

                    ctx.lineTo(
                        point.x,
                        point.y
                    );

                }

            }
        );


        ctx.strokeStyle =
            "#2563eb";


        ctx.lineWidth = 3;


        ctx.stroke();


        points.forEach(
            point => {

                ctx.beginPath();


                ctx.arc(
                    point.x,
                    point.y,
                    5,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    "#2563eb";


                ctx.fill();


                if (
                    point.value > 0
                ) {

                    ctx.font =
                        "bold 11px Arial";


                    ctx.fillStyle =
                        isLight
                            ? "#111827"
                            : "#f1f5f9";


                    const text =
                        formatMoney(
                            point.value
                        );


                    const textWidth =
                        ctx.measureText(
                            text
                        ).width;


                    let textX =
                        point.x -
                        textWidth /
                        2;


                    if (textX < 5) {

                        textX = 5;

                    }


                    if (
                        textX +
                        textWidth >
                        width - 5
                    ) {

                        textX =
                            width -
                            textWidth -
                            5;

                    }


                    let textY =
                        point.y - 12;


                    if (
                        textY < 15
                    ) {

                        textY =
                            point.y + 22;

                    }


                    ctx.fillText(
                        text,
                        textX,
                        textY
                    );

                }

            }
        );

    }


    /* MONTHS */

    ctx.font =
        "12px Arial";


    ctx.fillStyle =
        isLight
            ? "#374151"
            : "#cbd5e1";


    months.forEach(
        (month, index) => {

            const x =
                paddingLeft +
                index /
                11 *
                chartWidth;


            ctx.fillText(
                month,
                x - 10,
                height - 12
            );

        }
    );

}


/* ==================================================
   CHART YEAR CHANGE
================================================== */

if (chartYear) {

    chartYear.addEventListener(
        "change",
        updateRevenueChart
    );

}


/* ==================================================
   THEME
================================================== */

function loadTheme() {

    const theme =
        localStorage.getItem(
            "gymTheme"
        );


    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    if (theme === "light") {

        document.body.classList.add(
            "light-mode"
        );


        if (themeToggle) {

            themeToggle.textContent =
                "🌙";

        }

    } else {

        document.body.classList.remove(
            "light-mode"
        );


        if (themeToggle) {

            themeToggle.textContent =
                "☀️";

        }

    }

}


const themeToggle =
    document.getElementById(
        "themeToggle"
    );


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "light-mode"
            );


            const isLight =
                document.body.classList.contains(
                    "light-mode"
                );


            localStorage.setItem(
                "gymTheme",
                isLight
                    ? "light"
                    : "dark"
            );


            this.textContent =
                isLight
                    ? "🌙"
                    : "☀️";


            updateRevenueChart();

        }
    );

}


/* ==================================================
   PROFILE
================================================== */

let currentProfileId = null;


function openProfile(id) {

    const member =
        members.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!member || !profileModal) {
        return;
    }


    currentProfileId =
        id;


    const status =
        getMemberStatus(member);


    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    if (profileAvatar) {

        profileAvatar.textContent =
            member.name
                .charAt(0)
                .toUpperCase();

    }


    document.getElementById(
        "profileName"
    ).textContent =
        member.name;


    document.getElementById(
        "profilePhone"
    ).textContent =
        member.phone;


    const statusElement =
        document.getElementById(
            "profileStatus"
        );


    if (statusElement) {

        statusElement.textContent =
            status.text;

        statusElement.className =
            status.className;

    }


    document.getElementById(
        "profilePlan"
    ).textContent =
        member.plan;


    document.getElementById(
        "profilePrice"
    ).textContent =
        formatMoney(
            member.price
        );


    document.getElementById(
        "profileStartDate"
    ).textContent =
        formatDate(
            member.startDate
        );


    document.getElementById(
        "profileEndDate"
    ).textContent =
        formatDate(
            member.endDate
        );


    displayProfilePayments(
        member.id
    );


    profileModal.classList.add(
        "show"
    );

}


function closeProfileModal() {

    if (!profileModal) return;

    profileModal.classList.remove(
        "show"
    );

}


function displayProfilePayments(
    memberId
) {

    const container =
        document.getElementById(
            "profilePayments"
        );


    if (!container) return;


    const memberPayments =
        payments.filter(
            payment =>
                String(
                    payment.memberId
                ) ===
                String(memberId)
        );


    const total =
        memberPayments.reduce(
            (
                sum,
                payment
            ) =>
                sum +
                Number(
                    payment.amount || 0
                ),
            0
        );


    const totalElement =
        document.getElementById(
            "profilePaymentTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            formatMoney(total);

    }


    container.innerHTML = "";


    if (
        memberPayments.length === 0
    ) {

        container.innerHTML = `
            <p style="color:#94a3b8;">
                Aucun paiement.
            </p>
        `;

        return;

    }


    [...memberPayments]
        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        )
        .forEach(payment => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "profile-payment";


            item.innerHTML = `

                <span>
                    ${formatDate(payment.date)}
                    ·
                    ${escapeHTML(
                        payment.method
                    )}
                </span>

                <strong>
                    ${formatMoney(
                        payment.amount
                    )}
                </strong>

            `;


            container.appendChild(item);

        });

}


const closeProfileModalBtn =
    document.getElementById(
        "closeProfileModal"
    );

if (closeProfileModalBtn) {

    closeProfileModalBtn.addEventListener(
        "click",
        closeProfileModal
    );

}


const profileCloseBtn =
    document.getElementById(
        "profileCloseBtn"
    );

if (profileCloseBtn) {

    profileCloseBtn.addEventListener(
        "click",
        closeProfileModal
    );

}


const profileRenewBtn =
    document.getElementById(
        "profileRenewBtn"
    );

if (profileRenewBtn) {

    profileRenewBtn.addEventListener(
        "click",
        function () {

            if (currentProfileId) {

                renewMember(
                    currentProfileId
                );

                openProfile(
                    currentProfileId
                );

            }

        }
    );

}


const profilePaymentBtn =
    document.getElementById(
        "profilePaymentBtn"
    );

if (profilePaymentBtn) {

    profilePaymentBtn.addEventListener(
        "click",
        function () {

            const memberId =
                currentProfileId;

            closeProfileModal();

            openPaymentModal(
                memberId
            );

        }
    );

}


/* ==================================================
   MODAL OVERLAY
================================================== */

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modal
                ) {

                    modal.classList.remove(
                        "show"
                    );

                }

            }
        );

    });


/* ==================================================
   ESC KEY
================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeMemberModal();

            closePaymentModal();

            closeProfileModal();

        }

    }
);


/* ==================================================
   WINDOW RESIZE
================================================== */

window.addEventListener(
    "resize",
    function () {

        updateRevenueChart();

    }
);


/* ==================================================
   INITIAL LOAD
================================================== */

setupChartYears();

loadTheme();

displayMembers();

displayPayments();

displayRecentPayments();

updatePaymentStats();

updateAnalytics();

loadPaymentMembers();

updateExpirationAlert();

updateRevenueChart();