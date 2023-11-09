var summary_data = [];
$(document).ready(function () {
    $('#submitButton').click(function () {
        // Get the selected values from the select controls
        var region = $('#region').val();
        var marketplaceValue = $('#marketplace').val();

        // Create the data object to be sent in the AJAX request
        var data = {
            region: region,
            marketplace: marketplaceValue
        };

        // Send the AJAX request
        $.ajax({
            url: '/get_access_key',
            method: 'POST',
            data: data,
            success: function (response) {
                // Handle the response from the server
                //console.log(response);
                var ta = document.getElementById('text');
                ta.innerHTML = response;
                localStorage.setItem('access_token', response);
                data.access_token = localStorage.getItem('access_token');
                $.ajax({
                    url: '/get_inventory_summary',
                    method: 'POST',
                    data: data,
                    success: function (res) {
                        // Handle the response from the server
                       summary_data.push(res);
                       //console.log(summary_data);
                       getSummaryNext(res);
                    },
                    error: function (error) {
                        console.error(error);
                    }
                });
            },
            error: function (error) {
                console.error(error);
            }
        });
    });
});
function getSummaryNext(res)
{
    if(res.nextToken === null && res.nextToken === "")
    {
        console.log(summary_data);
        return;
    }
    else
    {
        var region = $('#region').val();
        var marketplaceValue = $('#marketplace').val();
        var data = {
            region: region,
            marketplace: marketplaceValue,
            access_token: localStorage.getItem("access_token"),
            next_token: res.nextToken
        };
        $.ajax({
                    url: '/get_inventory_summary_next',
                    method: 'POST',
                    data: data,
                    success: function (res_m) {
                        // Handle the response from the server
                       summary_data.push(res_m.inventorySummaries);
                       getSummaryNext(res_m);
                    },
                    error: function (error) {
                        console.error(error);
                    }
                });
    }
}
function updateMarketplace() {
    var region = $('#region').val();
    var marketplace = $('#marketplace');
    marketplace.empty();

    // Add new options based on the selected value of select1
    if (region === 'na') {
        marketplace.append('<option value="A2EUQ1WTGCTBG2">Canada</option>');
        marketplace.append('<option value="ATVPDKIKX0DER">United States of America</option>');
        marketplace.append('<option value="A1AM78C64UM0Y8">Mexico</option>');
        marketplace.append('<option value="A2Q3Y263D00KWC">Brazil</option>');
    } else if (region === 'eu') {
        marketplace.append('<option value="A1RKKUPIHCS9HS">Spain</option>');
        marketplace.append('<option value="A1F83G8C2ARO7P">United Kingdom</option>');
        marketplace.append('<option value="A13V1IB3VIYZZH">France</option>');
        marketplace.append('<option value="AMEN7PMS3EDWL">Belgium</option>');
        marketplace.append('<option value="A1805IZSGTT6HS">Netherlands</option>');
        marketplace.append('<option value="A1PA6795UKMFR9">Germany</option>');
        marketplace.append('<option value="APJ6JRA9NG5V4">Italy</option>');
        marketplace.append('<option value="A2NODRKZP88ZB9">Sweden</option>');
        marketplace.append('<option value="AE08WJ6YKNBMC">South Africa</option>');
        marketplace.append('<option value="A1C3SOZRARQ6R3">Poland</option>');
        marketplace.append('<option value="ARBP9OOSHTCHU">Egypt</option>');
        marketplace.append('<option value="A33AVAJ2PDY3EV">Turkey</option>');
        marketplace.append('<option value="A17E79C6D8DWNP">Saudi Arabia</option>');
        marketplace.append('<option value="A2VIGQ35RCS4UG">United Arab Emirates</option>');
        marketplace.append('<option value="A21TJRUUN4KGV">India</option>');
    } else if (region === 'fe') {
        marketplace.append('<option value="A19VAU5U5O7RUS">Singapore</option>');
        marketplace.append('<option value="A39IBJ37TRP1C6">Australia</option>');
        marketplace.append('<option value="A1VC38T7YXB528">Japan</option>');
    }
}

// Update marketplace options when select1 value changes
$('#region').change(function () {
    updateMarketplace();
});
updateMarketplace();