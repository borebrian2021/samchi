/*!
* Start Bootstrap - Clean Blog v6.0.7 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/

function labnolIframe(e) {
    var t = document.createElement("iframe");
    t.setAttribute("src", "https://www.youtube.com/embed/" + e.dataset.id + "?autoplay=1&rel=0"),
        t.setAttribute("frameborder", "0"),
        t.setAttribute("allowfullscreen", "1"),
        t.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"),
        e.parentNode.replaceChild(t, e)
}
function initYouTubeVideos() {
    for (var e = document.getElementsByClassName("youtube-player"), t = 0; t < e.length; t++) {
        var i = e[t].dataset.id
            , n = document.createElement("div");
        n.setAttribute("data-id", i);
        var o = document.createElement("img");
        o.src = "//i.ytimg.com/vi/ID/maxresdefault.jpg".replace("ID", i),
            o.alt = "YouTube Video Thumbnail Image",
            n.appendChild(o);
        var s = document.createElement("div");
        s.setAttribute("class", "play"),
            n.appendChild(s),
            n.onclick = function () {
                labnolIframe(this)
            }
            ,
            e[t].appendChild(n)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function () {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if (currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });

    initYouTubeVideos();
})
//function closeLead(closedBy, closeTime,remarks,closeType,itemId) {
function closeLead(OrderID, itemID, itemPrice) {
    console.log(itemPrice)
    console.log(itemID)
    $('#leadId').text("Close Lead | " + OrderID);
    $('#itemId').val(itemID);
    $('#itemPrice').val(itemPrice);
    $('#closeLeadModal').modal('show');
    //const formData = new FormData();
    //formData.append("Id", id);

    //fetch('/umbraco/surface/Leads/ClaimLead', {
    //    method: 'POST',
    //    body: formData,
    //    headers: { 'Accept': 'application/json' }
    //})
    //    .then(res => {
    //        if (!res.ok) throw new Error("Network error");
    //        return res.json();
    //    })
    //    .then(data => {
    //        if (data.success) {
    //            alert(`✅ ${data.message}`);
    //            // Reload the page to reflect updated claim status
    //            location.reload();
    //        } else {
    //            alert(`⚠️ ${data.message || "Something went wrong, please try again."}`);
    //        }
    //    })
    //    .catch(error => {
    //        console.error("Error submitting claim:", error);
    //        alert("❌ Failed to claim lead. Check console for details.");
    //    });
}

// Handle form submit
function submitCloseLead(event) {
    event.preventDefault();
    const closedBy = document.getElementById("closedBy").value;
    const closeTime = document.getElementById("closeTime").value;
    const remarks = document.getElementById("remarks").value;
    const closeType = document.getElementById("closeType").value;
    const itemId = document.getElementById("itemId").value;
    const itemPrice = document.getElementById("itemPrice").value;

    closeLead(closedBy, closeTime, remarks, closeType, itemId, itemPrice);
}

 //Example close lead handler
//function closeLead(closedBy, closeTime, remarks, closeType, itemId) {
//    console.log("Closing lead:", { closedBy, closeTime, remarks, closeType, itemId });

//    const formData = new FormData();
//    formData.append("ClosedBy", closedBy);
//    formData.append("CloseTime", closeTime);
//    formData.append("Remarks", remarks);
//    formData.append("CloseType", closeType);
//    formData.append("ItemId", itemId);

//    fetch('/umbraco/surface/Leads/CloseLead', {
//        method: 'POST',
//        body: formData,
//        headers: { 'Accept': 'application/json' }
//    })
//        .then(res => {
//            if (!res.ok) throw new Error("Network error");
//            return res.json();
//        })
//        .then(data => {
//            if (data.success) {
//                alert("Lead closed successfully!");
//                location.reload();
//            } else {
//                alert(data.message || "Something went wrong while closing the lead.");
//            }
//        })
//        .catch(error => {
//            console.error("Error closing lead:", error);
//            alert("Failed to close lead. Check console for details.");
//        });
//}
function openRemarks(Order, remarks) {
    $('#remarksModal').modal('show');
    $('#leadId').text("Close Lead | " + Order);
    $('#remarksId').text("Lead closure remarks for lead ID | " + Order);
    $('#remarks-id').text(remarks);
}
function revokeClaim(id) {
    Swal.fire({
        title: "Revoke Claim?",
        text: "Are you sure you want to revoke your claim for this lead?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, revoke it!"
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append("Id", id);

            fetch('/umbraco/surface/Leads/RevokeClaim', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Network error");
                    return res.json();
                })
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: "success",
                            title: "Revoked!",
                            text: data.message,
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => location.reload());
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: data.message || "Something went wrong, please try again."
                        });
                    }
                })
                .catch(error => {
                    console.error("Error revoking claim:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Failed",
                        text: "❌ Failed to revoke claim. Check console for details."
                    });
                });
        }
    });
}
function claimLead(id) {
    Swal.fire({
        title: "Claim this lead?",
        text: "Are you sure you want to claim this lead?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, claim it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("Submitting lead:", { id });

            const formData = new FormData();
            formData.append("Id", id);

            fetch('/umbraco/surface/Leads/ClaimLead', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Network error");
                    return res.json();
                })
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Lead Claimed',
                            text: data.message,
                            showConfirmButton: false,
                            timer: 2000
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Action Failed',
                            text: data.message || "Something went wrong, please try again.",
                            confirmButtonText: 'OK'
                        });
                    }
                })
                .catch(error => {
                    console.error("Error submitting claim:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: 'Failed to claim lead. Check console for details.',
                        confirmButtonText: 'OK'
                    });
                });
        }
    });
}
function openLoyaltyAccountForm(email = '',phoneNumber,) {
    Swal.fire({
        title: 'Create Loyalty Account',
        html: `
            <div id="loyalty-form" class="text-start">
                <label class="form-label mt-2">Order ID</label>
                <input id="lp-order-id" type="text" class="form-control" placeholder="Enter order ID">

                <label class="form-label mt-2">WhatsApp Number</label>
                <input id="lp-whatsapp" type="text" class="form-control" placeholder="e.g. 0722123456">

                <label class="form-label mt-2">Loyalty Points Earned</label>
                <input id="lp-points" type="number" min="0" class="form-control" placeholder="e.g. 10">

                <label class="form-label mt-2">Number of Orders</label>
                <input id="lp-num-orders" type="number" min="0" value="1" class="form-control" placeholder="e.g. 1">

               
                <label class="form-label mt-2">Last Order Date</label>
                <input id="lp-last-date" type="date" class="form-control">

                <label class="form-label mt-2">Created By</label>
                <input id="lp-created-by" type="text" class="form-control" value="${email}" placeholder="Enter your email">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Create Account',
        cancelButtonText: 'Cancel',
        allowEnterKey: false, // 🚫 prevents enter key refresh
        didOpen: () => {
            // 👇 prevent any hidden <form> behavior
            const popup = Swal.getPopup();
            popup.addEventListener('submit', e => e.preventDefault());
        },
        preConfirm: () => {
            console.log("PreConfirm Triggered ✅");
            const orderId = document.getElementById('lp-order-id').value.trim();
            const whatsapp = document.getElementById('lp-whatsapp').value.trim();
            const points = document.getElementById('lp-points').value.trim();
            const numOrders = document.getElementById('lp-num-orders').value.trim();
            const lastDate = document.getElementById('lp-last-date').value.trim();
            const createdBy = document.getElementById('lp-created-by').value.trim();

            if (!whatsapp || !points || !numOrders || !lastDate || !createdBy) {
                Swal.showValidationMessage(`⚠️ Please fill in all required fields.`);
                return false;
            }

            return { orderId, whatsapp, points, numOrders, lastDate, createdBy };
        }
    }).then(result => {
        if (result.isConfirmed) {
            console.log("Confirmed ✅", result.value);
            submitLoyaltyAccount(result.value);
        }
    });
}

function submitLoyaltyAccount(data) {
    console.log("Points Eraned:"+data.points)
    const formData = new FormData();
    formData.append("OrderId", data.orderId);
    formData.append("WhatAppNumber", data.whatsapp);
    formData.append("LoyaltyPointsEarned", data.points);
    formData.append("NumberOfOrders", data.numOrders);
    formData.append("LastOrderDate", data.lastDate);
    formData.append("CreatedBy", data.createdBy);

    fetch('/umbraco/surface/Leads/CreateAccount', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
        .then(res => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
        })
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created',
                    text: data.message || 'Loyalty account has been created successfully!',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => location.reload());
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Failed',
                    text: data.message || 'Something went wrong, please try again.'
                });
            }
        })
        .catch(error => {
            console.error("Error creating loyalty account:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Failed to create loyalty account. Check console for details.'
            });
        });
}


function newLead(event, phoneNumber, itemId, orderId, price, itemName, parentId) {
    event.preventDefault();
    console.log("Submitting lead:", { phoneNumber, itemId, orderId, price, itemName, parentId });

    const formData = new FormData();
    formData.append("PhoneNumber", phoneNumber);
    formData.append("ItemId", itemId);
    formData.append("OrderId", orderId);
    formData.append("Price", price);
    formData.append("ItemName", itemName);
    formData.append("ParentId", parentId);
    formData.append("LoyaltyPoints",(price/100))

    fetch('/umbraco/surface/Leads/SubmitInquiry', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
        .then(res => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
        })
        .then(data => {
            console.log("Server response:", data);

            if (data.success) {
                const number = phoneNumber.replace('+', '').replace(/\s/g, '');
                const loyaltyPoints = (price / 100).toFixed(1); // 1 decimal place for clarity
                const message = encodeURIComponent(
                    `Hello Samtech Solutions 👋,\n\n*Order ID (${orderId})*\nI'm interested in the item *${itemName}* priced at *KES ${price}*.\n\n🏅 *Loyalty Points to be earned:* ${loyaltyPoints}\n\nPlease share more details.`
                );

                const waLink = `https://wa.me/${number}?text=${message}`;
                window.open(waLink, '_blank');
            } else {
                alert(data.message || "Something went wrong, please try again.");
            }

        })
        .catch(error => {
            console.error("Error submitting inquiry:", error);
            alert("Failed to create inquiry. Check console for details.");
        });
}

function closeLeadAndSubmit(event, phoneNumber, itemId, orderId, price, itemName, parentId) {
    event.preventDefault();
    console.log("Submitting lead:", { phoneNumber, itemId, orderId, price, itemName, parentId });

    const formData = new FormData();
    formData.append("PhoneNumber", phoneNumber);
    formData.append("ItemId", itemId);
    formData.append("OrderId", orderId);
    formData.append("Price", price);
    formData.append("ItemName", itemName);
    formData.append("ParentId", parentId);
    formData.append("LoyaltyPoints",(price/100))

    fetch('/umbraco/surface/Leads/SubmitInquiry', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
        .then(res => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
        })
        .then(data => {
            console.log("Server response:", data);

            if (data.success) {
                const number = phoneNumber.replace('+', '').replace(/\s/g, '');
                const loyaltyPoints = (price / 100).toFixed(1); // 1 decimal place for clarity
                const message = encodeURIComponent(
                    `Hello Samtech Solutions 👋,\n\n*Order ID (${orderId})*\nI'm interested in the item *${itemName}* priced at *KES ${price}*.\n\n🏅 *Loyalty Points to be earned:* ${loyaltyPoints}\n\nPlease share more details.`
                );

                const waLink = `https://wa.me/${number}?text=${message}`;
                window.open(waLink, '_blank');
            } else {
                alert(data.message || "Something went wrong, please try again.");
            }

        })
        .catch(error => {
            console.error("Error submitting inquiry:", error);
            alert("Failed to create inquiry. Check console for details.");
        });
}

async function goToCreateAccount(event,email) {
    $('#closeLeadModal').modal('hide');
    const phoneNumber = document.getElementById("phoneNumber").value;
    const itemPrice = document.getElementById("itemPrice").value;
    const points = itemPrice / 100

    console.log(phoneNumber);
    console.log(points);

    Swal.fire({
        title: 'Confirm Creation of account for '+phoneNumber,
        html: `
            <div id="loyalty-form" class="text-start">
                
                <input id="lp-order-id" type="text" class="form-control" hidden placeholder="Enter order ID">

                <label class="form-label mt-2">WhatsApp Number</label>
                <input id="lp-whatsapp" value="${phoneNumber}" type="text" class="form-control" placeholder="e.g. 0722123456">

                <label class="form-label mt-2">Loyalty Points Earned</label>
                <input id="lp-points" type="number" value=${points} min="0" class="form-control" placeholder="e.g. 10">

                <label class="form-label mt-2">Number of Orders</label>
                <input id="lp-num-orders" type="number"  min="0" value="1" class="form-control" placeholder="e.g. 1">

             <input id="lp-last-date" type="date" value="${ new Date().toISOString().split('T')[0]}" class= "form-control" >


                <label class="form-label mt-2">Created By</label>
                <input id="lp-created-by" type="text" class="form-control" disabled value="${email}" placeholder="Enter your email">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Create Account',
        cancelButtonText: 'Cancel',
        allowEnterKey: false, // 🚫 prevents enter key refresh
        didOpen: () => {
            // 👇 prevent any hidden <form> behavior
            const popup = Swal.getPopup();
            popup.addEventListener('submit', e => e.preventDefault());
        },
        preConfirm: () => {
            console.log("PreConfirm Triggered ✅");
            const orderId = document.getElementById('lp-order-id').value.trim();
            const whatsapp = document.getElementById('lp-whatsapp').value.trim();
            const points = document.getElementById('lp-points').value.trim();
            const numOrders = document.getElementById('lp-num-orders').value.trim();
            const lastDate = document.getElementById('lp-last-date').value.trim();
            const createdBy = document.getElementById('lp-created-by').value.trim();

            if (!whatsapp || !points || !numOrders || !lastDate || !createdBy) {
                Swal.showValidationMessage(`⚠️ Please fill in all required fields.`);
                return false;
            }

            return { orderId, whatsapp, points, numOrders, lastDate, createdBy };
        }
    }).then(result => {
        if (result.isConfirmed) {
            console.log("Confirmed ✅", result.value);
            submitLoyaltyAccount(result.value);
        }
    });
}


async function submitCloseLead1(event) {

    event.preventDefault();
    alert("mdmdm")
    const alertBox = document.getElementById("closeLeadAlert");
    const closedBy = document.getElementById("closedBy").value;
    const closeTime = document.getElementById("closeTime").value;
    const closeType = document.getElementById("closeType").value;
    const remarks = document.getElementById("remarks").value;
    const itemId = document.getElementById("itemId").value;
    const itemPrice = document.getElementById("itemPrice").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    if (!closeType || !closeTime || !remarks) {
        showAlert("Please fill in all required fields.", "danger");
        return;
    }

    const formData = new FormData();
    formData.append("phone", phoneNumber);
    formData.append("closeTime", closeTime);
    formData.append("closeType", closeType);
    formData.append("remarks", remarks);
    formData.append("itemId", itemId);
    formData.append("itemPrice", itemPrice);

    try {
        const res = await fetch('/umbraco/surface/Leads/CloseLeads', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Request failed");

        if (data.success) {
            showAlert(data.message || "Lead closed successfully!", "success");
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('closeLeadModal'));
                modal.hide();
                window.location.reload();
            }, 1500);
        } else {
            showAlert(data.message || "Failed to close lead.", "danger");
        }
    } catch (error) {
        console.error("Error closing lead:", error);
        showAlert("Something went wrong. Please try again.", "danger");
    }
    function showAlert(message, type) {
        alertBox.className = `alert alert-${type} mx-3 mt-3`;
        alertBox.innerHTML = `<i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>${message}`;
        alertBox.classList.remove("d-none");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const phoneInput = document.getElementById("phoneNumber");
    const feedback = document.getElementById("phoneFeedback");
    const otherFields = document.getElementById("otherFields");       // container of other inputs
    const formFooter = document.getElementById("formFooter");         // modal footer
    const createBtnWrapper = document.getElementById("createAccountWrapper"); // create btn container

    if (!phoneInput || !feedback) return;

    // ✅ Helper to set feedback message & color
    function setFeedback(message, isSuccess = false) {
        feedback.textContent = message;
        feedback.classList.remove("text-success", "text-danger");
        feedback.classList.add(isSuccess ? "text-success" : "text-danger");
    }

    // ✅ Helper to toggle visibility
    function toggleVisibility(showFields, showCreateBtn) {
        if (showFields) {
            otherFields?.classList.remove("d-none");
            formFooter?.classList.remove("d-none");
        } else {
            otherFields?.classList.add("d-none");
            formFooter?.classList.add("d-none");
        }

        if (showCreateBtn) {
            createBtnWrapper?.classList.remove("d-none");
        } else {


            createBtnWrapper?.classList.add("d-none");
        }
    }

    // ✅ Debounce to avoid multiple fetch calls
    let debounceTimer;
    phoneInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(checkPhoneNumber, 500);
    });

    // ✅ Main check function
    async function checkPhoneNumber() {
        const phone = phoneInput.value.trim();

        // Reset UI before each check
        toggleVisibility(false, false);
        setFeedback("");

        // ✅ Validate phone number length
        const isValidPhone = phone && phone.length >= 10 && phone.length <= 14;
        if (!isValidPhone) {
            setFeedback("Please enter a valid phone number.");
            toggleVisibility(false, true); // Show create account button even if invalid
            return;
        }

        try {
            const response = await fetch(
                `/umbraco/surface/Leads/CheckPhone?phone=${encodeURIComponent(phone)}`
            );

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            if (data.exists) {
                setFeedback(`✅ Number found: ${data.name || "Existing lead"}`, true);
                toggleVisibility(true, false); // Show rest of form
            } else {
                setFeedback("❌ No record found for this number.");
                toggleVisibility(false, true); // Show create account button
            }
        } catch (error) {
            console.error("Error checking phone number:", error);
            setFeedback("⚠️ Could not check phone number.");
            toggleVisibility(false, true); // Allow creating account even if check fails
        }
    }

});

// ✅ Optional: Create Account action
function createAccount() {
    alert("Redirect or open modal to create new account");
}
