/* =========================
   LOGIN PROTECTION
========================= */

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href =
        "./index.html";
}


/* =========================
   LOGOUT
========================= */

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "isLoggedIn"
        );

        window.location.href =
            "./index.html";

    }
);


/* =========================
   SIDEBAR NAVIGATION
========================= */

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


menuItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                menuItems.forEach(
                    function (menu) {

                        menu.classList.remove(
                            "active"
                        );

                    }
                );

                item.classList.add(
                    "active"
                );

            }
        );

    }
);


/* =========================
   MEMBERS
========================= */

let members =
    JSON.parse(
        localStorage.getItem(
            "members"
        )
    ) || [];


/* =========================
   MEMBER ELEMENTS
========================= */

const memberModal =
    document.getElementById(
        "memberModal"
    );

const memberForm =
    document.getElementById(
        "memberForm"
    );

const addMemberBtn =
    document.getElementById(
        "addMemberBtn"
    );

const closeMemberModal =
    document.getElementById(
        "closeMemberModal"
    );

const cancelMember =
    document.getElementById(
        "cancelMember"
    );

const membersTable =
    document.getElementById(
        "membersTable"
    );

const searchMember =
    document.getElementById(
        "searchMember"
    );

const filterPlan =
    document.getElementById(
        "filterPlan"
    );


/* =========================
   OPEN MEMBER MODAL
========================= */

addMemberBtn.addEventListener(
    "click",
    function () {

        memberForm.reset();

        document.getElementById(
            "memberId"
        ).value = "";

        document.getElementById(
            "memberModalTitle"
        ).textContent =
            "Ajouter un membre";

        memberModal.classList.add(
            "active"
        );

    }
);


/* =========================
   CLOSE MEMBER MODAL
========================= */

function closeMemberModalFunction() {

    memberModal.classList.remove(
        "active"
    );

}


closeMemberModal.addEventListener(
    "click",
    closeMemberModalFunction
);


cancelMember.addEventListener(
    "click",
    closeMemberModalFunction
);


/* =========================
   ADD / EDIT MEMBER
========================= */

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


        const endDate =
            calculateEndDate(
                startDate,
                plan
            );


        if (id) {

            const member =
                members.find(
                    function (member) {

                        return member.id ==
                            id;

                    }
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

            }

        } else {

            const newMember = {

                id:
                    Date.now(),

                name:
                    name,

                phone:
                    phone,

                plan:
                    plan,

                price:
                    price,

                startDate:
                    startDate,

                endDate:
                    endDate

            };


            members.push(
                newMember
            );

        }


        saveMembers();

        displayMembers();

        updateAnalytics();

        loadPaymentMembers();

        closeMemberModalFunction();

    }
);


/* =========================
   CALCULATE END DATE
========================= */

function calculateEndDate(
    startDate,
    plan
) {

    const date =
        new Date(
            startDate
        );


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


    return formatDate(
        date
    );

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================
   SAVE MEMBERS
========================= */

function saveMembers() {

    localStorage.setItem(
        "members",
        JSON.stringify(
            members
        )
    );

}


/* =========================
   MEMBER STATUS
========================= */

function getMemberStatus(
    endDate
) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const expiration =
        new Date(
            endDate
        );


    if (
        expiration >= today
    ) {

        return "Active";

    }


    return "Expired";

}


/* =========================
   DISPLAY MEMBERS
========================= */

function displayMembers(
    data = members
) {

    membersTable.innerHTML = "";


    if (
        data.length === 0
    ) {

        membersTable.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        color:#9ca3af;
                        padding:30px;
                    "
                >

                    Aucun membre trouvé.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(
        function (member) {

            const status =
                getMemberStatus(
                    member.endDate
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${member.name}
                    </strong>
                </td>

                <td>
                    ${member.phone}
                </td>

                <td>
                    ${member.plan}
                </td>

                <td>
                    ${member.price} DH
                </td>

                <td>
                    ${member.startDate}
                </td>

                <td>
                    ${member.endDate}
                </td>

                <td>

                    <span
                        class="status ${
                            status === "Active"
                            ? "status-active"
                            : "status-expired"
                        }"
                    >

                        ${status}

                    </span>

                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editMember(${member.id})"
                    >
                        Modifier
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteMember(${member.id})"
                    >
                        Supprimer
                    </button>

                </td>

            `;


            membersTable.appendChild(
                row
            );

        }
    );

}


/* =========================
   EDIT MEMBER
========================= */

function editMember(id) {

    const member =
        members.find(
            function (member) {

                return member.id === id;

            }
        );


    if (!member) {
        return;
    }


    document.getElementById(
        "memberId"
    ).value =
        member.id;


    document.getElementById(
        "memberName"
    ).value =
        member.name;


    document.getElementById(
        "memberPhone"
    ).value =
        member.phone;


    document.getElementById(
        "memberPlan"
    ).value =
        member.plan;


    document.getElementById(
        "memberPrice"
    ).value =
        member.price;


    document.getElementById(
        "memberStartDate"
    ).value =
        member.startDate;


    document.getElementById(
        "memberModalTitle"
    ).textContent =
        "Modifier le membre";


    memberModal.classList.add(
        "active"
    );

}


/* =========================
   DELETE MEMBER
========================= */

function deleteMember(id) {

    const confirmed =
        confirm(
            "Voulez-vous supprimer ce membre ?"
        );


    if (!confirmed) {
        return;
    }


    members =
        members.filter(
            function (member) {

                return member.id !== id;

            }
        );


    saveMembers();

    displayMembers();

    updateAnalytics();

    loadPaymentMembers();

}


/* =========================
   SEARCH
========================= */

searchMember.addEventListener(
    "input",
    filterMembers
);


filterPlan.addEventListener(
    "change",
    filterMembers
);


function filterMembers() {

    const search =
        searchMember.value
            .toLowerCase()
            .trim();


    const plan =
        filterPlan.value;


    const filtered =
        members.filter(
            function (member) {

                const matchesSearch =
                    member.name
                        .toLowerCase()
                        .includes(search);


                const matchesPlan =
                    plan === "all" ||
                    member.plan === plan;


                return (
                    matchesSearch &&
                    matchesPlan
                );

            }
        );


    displayMembers(
        filtered
    );

}


/* =========================
   PAYMENTS
========================= */

let payments =
    JSON.parse(
        localStorage.getItem(
            "payments"
        )
    ) || [];


/* =========================
   PAYMENT ELEMENTS
========================= */

const paymentModal =
    document.getElementById(
        "paymentModal"
    );

const paymentForm =
    document.getElementById(
        "paymentForm"
    );

const addPaymentBtn =
    document.getElementById(
        "addPaymentBtn"
    );

const closePaymentModal =
    document.getElementById(
        "closePaymentModal"
    );

const cancelPayment =
    document.getElementById(
        "cancelPayment"
    );

const paymentsTable =
    document.getElementById(
        "paymentsTable"
    );

const paymentMember =
    document.getElementById(
        "paymentMember"
    );


/* =========================
   OPEN PAYMENT MODAL
========================= */

addPaymentBtn.addEventListener(
    "click",
    function () {

        paymentForm.reset();

        loadPaymentMembers();

        document.getElementById(
            "paymentDate"
        ).value =
            formatDate(
                new Date()
            );

        paymentModal.classList.add(
            "active"
        );

    }
);


/* =========================
   CLOSE PAYMENT MODAL
========================= */

function closePaymentModalFunction() {

    paymentModal.classList.remove(
        "active"
    );

}


closePaymentModal.addEventListener(
    "click",
    closePaymentModalFunction
);


cancelPayment.addEventListener(
    "click",
    closePaymentModalFunction
);


/* =========================
   LOAD MEMBERS IN PAYMENT
========================= */

function loadPaymentMembers() {

    paymentMember.innerHTML = "";


    if (
        members.length === 0
    ) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            "Aucun membre disponible";

        paymentMember.appendChild(
            option
        );

        return;

    }


    members.forEach(
        function (member) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                member.id;


            option.textContent =
                member.name;


            paymentMember.appendChild(
                option
            );

        }
    );

}


/* =========================
   ADD PAYMENT
========================= */

paymentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const memberId =
            Number(
                paymentMember.value
            );


        const member =
            members.find(
                function (member) {

                    return member.id === memberId;

                }
            );


        if (!member) {

            alert(
                "Veuillez sélectionner un membre."
            );

            return;

        }


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


        const newPayment = {

            id:
                Date.now(),

            memberId:
                memberId,

            memberName:
                member.name,

            amount:
                amount,

            date:
                date,

            method:
                method

        };


        payments.push(
            newPayment
        );


        savePayments();

        displayPayments();

        closePaymentModalFunction();

    }
);


/* =========================
   SAVE PAYMENTS
========================= */

function savePayments() {

    localStorage.setItem(
        "payments",
        JSON.stringify(
            payments
        )
    );

}


/* =========================
   DISPLAY PAYMENTS
========================= */

function displayPayments() {

    paymentsTable.innerHTML = "";


    if (
        payments.length === 0
    ) {

        paymentsTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        color:#9ca3af;
                        padding:30px;
                    "
                >

                    Aucun paiement enregistré.

                </td>

            </tr>

        `;

    } else {

        payments
            .slice()
            .reverse()
            .forEach(
                function (payment) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${payment.memberName}
                        </td>

                        <td>
                            <strong>
                                ${payment.amount} DH
                            </strong>
                        </td>

                        <td>
                            ${payment.date}
                        </td>

                        <td>
                            ${payment.method}
                        </td>

                        <td>

                            <button
                                class="delete-btn"
                                onclick="deletePayment(${payment.id})"
                            >
                                Supprimer
                            </button>

                        </td>

                    `;


                    paymentsTable.appendChild(
                        row
                    );

                }
            );

    }


    updatePaymentStats();

    updateAnalytics();

    displayRecentPayments();

    updateRevenueChart();

}


/* =========================
   PAYMENT STATS
========================= */

function updatePaymentStats() {

    const total =
        payments.reduce(
            function (
                total,
                payment
            ) {

                return (
                    total +
                    Number(
                        payment.amount || 0
                    )
                );

            },
            0
        );


    document.getElementById(
        "paymentCount"
    ).textContent =
        payments.length;


    document.getElementById(
        "paymentTotal"
    ).textContent =
        total + " DH";

}


/* =========================
   DELETE PAYMENT
========================= */

function deletePayment(id) {

    const confirmed =
        confirm(
            "Voulez-vous supprimer ce paiement ?"
        );


    if (!confirmed) {
        return;
    }


    payments =
        payments.filter(
            function (payment) {

                return payment.id !== id;

            }
        );


    savePayments();

    displayPayments();

}


/* =========================
   ANALYTICS
========================= */

function updateAnalytics() {

    const totalMembers =
        members.length;


    let activeMembers = 0;

    let expiredMembers = 0;


    members.forEach(
        function (member) {

            if (
                getMemberStatus(
                    member.endDate
                ) === "Active"
            ) {

                activeMembers++;

            } else {

                expiredMembers++;

            }

        }
    );


    const totalPayments =
        payments.reduce(
            function (
                total,
                payment
            ) {

                return (
                    total +
                    Number(
                        payment.amount || 0
                    )
                );

            },
            0
        );


    const currentMonth =
        new Date().getMonth();


    const currentYear =
        new Date().getFullYear();


    const monthlyRevenue =
        payments.reduce(
            function (
                total,
                payment
            ) {

                if (!payment.date) {
                    return total;
                }


                const date =
                    new Date(
                        payment.date
                    );


                if (
                    date.getMonth() ===
                    currentMonth
                    &&
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


    document.getElementById(
        "totalMembers"
    ).textContent =
        totalMembers;


    document.getElementById(
        "activeMembers"
    ).textContent =
        activeMembers;


    document.getElementById(
        "expiredMembers"
    ).textContent =
        expiredMembers;


    document.getElementById(
        "totalPayments"
    ).textContent =
        totalPayments + " DH";


    document.getElementById(
        "monthlyRevenue"
    ).textContent =
        monthlyRevenue + " DH";

}


/* =========================
   RECENT PAYMENTS
========================= */

function displayRecentPayments() {

    const container =
        document.getElementById(
            "recentPayments"
        );


    container.innerHTML = "";


    const recent =
        payments
            .slice()
            .reverse()
            .slice(
                0,
                5
            );


    if (
        recent.length === 0
    ) {

        container.innerHTML = `

            <div
                style="
                    color:#9ca3af;
                    text-align:center;
                    padding:20px;
                "
            >

                Aucun paiement récent.

            </div>

        `;

        return;

    }


    recent.forEach(
        function (payment) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "recent-payment";


            div.innerHTML = `

                <div>

                    <strong>
                        ${payment.memberName}
                    </strong>

                    <small>
                        ${payment.date}
                        ·
                        ${payment.method}
                    </small>

                </div>


                <div class="payment-amount">

                    +${payment.amount} DH

                </div>

            `;


            container.appendChild(
                div
            );

        }
    );

}


/* =========================
   OFFLINE REVENUE CHART
========================= */

const revenueChartCanvas =
    document.getElementById(
        "revenueChart"
    );


const chartContext =
    revenueChartCanvas.getContext(
        "2d"
    );


function updateRevenueChart() {

    const canvas =
        revenueChartCanvas;


    const ctx =
        chartContext;


    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;

    }


    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        width * ratio;


    canvas.height =
        height * ratio;


    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


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


    const monthlyRevenue =
        Array(12).fill(0);


    payments.forEach(
        function (payment) {

            if (!payment.date) {
                return;
            }


            const paymentDate =
                new Date(
                    payment.date
                );


            if (
                isNaN(
                    paymentDate.getTime()
                )
            ) {

                return;

            }


            const month =
                paymentDate.getMonth();


            monthlyRevenue[month] +=
                Number(
                    payment.amount || 0
                );

        }
    );


    const paddingLeft = 65;

    const paddingRight = 25;

    const paddingTop = 35;

    const paddingBottom = 50;


    const chartWidth =
        width -
        paddingLeft -
        paddingRight;


    const chartHeight =
        height -
        paddingTop -
        paddingBottom;


    const maxRevenue =
        Math.max(
            ...monthlyRevenue,
            100
        );


    const roundedMax =
        Math.ceil(
            maxRevenue / 100
        ) * 100;


    ctx.fillStyle =
        "#111827";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    const gridLines = 5;


    ctx.font =
        "12px Arial";


    ctx.textAlign =
        "right";


    ctx.textBaseline =
        "middle";


    for (
        let i = 0;
        i <= gridLines;
        i++
    ) {

        const y =
            paddingTop +
            (
                chartHeight /
                gridLines
            ) * i;


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


        ctx.strokeStyle =
            "#374151";


        ctx.lineWidth =
            1;


        ctx.stroke();


        const value =
            roundedMax -
            (
                roundedMax /
                gridLines
            ) * i;


        ctx.fillStyle =
            "#9ca3af";


        ctx.fillText(
            Math.round(value) +
            " DH",
            paddingLeft - 10,
            y
        );

    }


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "top";


    months.forEach(
        function (
            month,
            index
        ) {

            const x =
                paddingLeft +
                (
                    chartWidth /
                    11
                ) * index;


            ctx.fillStyle =
                "#9ca3af";


            ctx.fillText(
                month,
                x,
                height -
                paddingBottom +
                18
            );

        }
    );


    const points = [];


    monthlyRevenue.forEach(
        function (
            revenue,
            index
        ) {

            const x =
                paddingLeft +
                (
                    chartWidth /
                    11
                ) * index;


            const y =
                paddingTop +
                chartHeight -
                (
                    revenue /
                    roundedMax
                ) *
                chartHeight;


            points.push({

                x: x,

                y: y,

                value: revenue

            });

        }
    );


    /* AREA */

    ctx.beginPath();


    points.forEach(
        function (
            point,
            index
        ) {

            if (
                index === 0
            ) {

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


    ctx.lineTo(
        points[
            points.length - 1
        ].x,
        paddingTop +
        chartHeight
    );


    ctx.lineTo(
        points[0].x,
        paddingTop +
        chartHeight
    );


    ctx.closePath();


    const gradient =
        ctx.createLinearGradient(
            0,
            paddingTop,
            0,
            paddingTop +
            chartHeight
        );


    gradient.addColorStop(
        0,
        "rgba(59,130,246,0.30)"
    );


    gradient.addColorStop(
        1,
        "rgba(59,130,246,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.fill();


    /* LINE */

    ctx.beginPath();


    points.forEach(
        function (
            point,
            index
        ) {

            if (
                index === 0
            ) {

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
        "#3b82f6";


    ctx.lineWidth =
        3;


    ctx.lineJoin =
        "round";


    ctx.lineCap =
        "round";


    ctx.stroke();


    /* POINTS */

    points.forEach(
        function (
            point
        ) {

            ctx.beginPath();


            ctx.arc(
                point.x,
                point.y,
                5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#3b82f6";


            ctx.fill();


            ctx.beginPath();


            ctx.arc(
                point.x,
                point.y,
                2,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ffffff";


            ctx.fill();

        }
    );


    /* VALUES */

    points.forEach(
        function (
            point
        ) {

            if (
                point.value > 0
            ) {

                ctx.font =
                    "bold 11px Arial";


                ctx.textAlign =
                    "center";


                ctx.textBaseline =
                    "bottom";


                ctx.fillStyle =
                    "#ffffff";


                ctx.fillText(
                    point.value +
                    " DH",
                    point.x,
                    point.y - 10
                );

            }

        }
    );


    /* NO DATA */

    const totalRevenue =
        monthlyRevenue.reduce(
            function (
                total,
                value
            ) {

                return (
                    total +
                    value
                );

            },
            0
        );


    if (
        totalRevenue === 0
    ) {

        ctx.font =
            "16px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillStyle =
            "#9ca3af";


        ctx.fillText(
            "Aucun paiement enregistré",
            width / 2,
            height / 2
        );

    }

}


/* =========================
   RESIZE CHART
========================= */

window.addEventListener(
    "resize",
    function () {

        updateRevenueChart();

    }
);


/* =========================
   INITIAL LOAD
========================= */

displayMembers();

displayPayments();

updateAnalytics();

loadPaymentMembers();

updateRevenueChart();

// =========================
// DARK / LIGHT MODE
// =========================

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("gymTheme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        themeToggle.textContent = "☀️";

        localStorage.setItem("gymTheme", "light");

    } else {

        themeToggle.textContent = "🌙";

        localStorage.setItem("gymTheme", "dark");

    }

});