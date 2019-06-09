// Defering of rendering of graphs until data is loaded
queue()
    .defer(d3.csv, "data/seo.csv")
    .await(makeGraphs);

// Function for rendering all graphs
function makeGraphs(error, seoData) {
    var ndx = crossfilter(seoData);

    show_website_selector(ndx);

    show_http_status(ndx, "#http-status");

    show_page_authority(ndx);
    show_domain_authority(ndx);
    show_moz_rank(ndx);

    show_links(ndx);
    show_equity_links(ndx);
    show_trust_score(ndx);

    dc.renderAll();
}

// Website Selector
function show_website_selector(ndx) {
    dim = ndx.dimension(dc.pluck('site'));
    group = dim.group();

    dc.selectMenu("#website-selector")
        .dimension(dim)
        .group(group);
}

// Status Table
function show_http_status(ndx) {
    dim = ndx.dimension(dc.pluck('site'));
    
    dc.dataTable("#http-status")
        .dimension(dim)
        .group(function(d) {
            return d.site;
        })
        .size(Infinity)
        .columns([{
                label: "Response Code",
                format: function(d) { return d.response_code; }
            },
            {
                label: "Spam Score",
                format: function(d) { return d.trust_score; }
            }
        ])
        .sortBy(function(d) {
            return d.value;
        })
}

// Page Authority Chart
function show_page_authority(ndx) {
    var dim = ndx.dimension(dc.pluck('site'));
    var group = dim.group().reduceSum(dc.pluck('page_authority'));

    dc.barChart("#page-authority")
        .width(400)
        .height(290)
        .margins({ top: 10, right: 55, bottom: 30, left: 55 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .colorAccessor(function (d, i){return i;})
        .xUnits(dc.units.ordinal)
        .yAxis().ticks(20);
}

// Domain Authority Chart
function show_domain_authority(ndx) {
    var dim = ndx.dimension(dc.pluck('site'));
    var group = dim.group().reduceSum(dc.pluck('domain_authority'));

    dc.barChart("#domain-authority")
        .width(400)
        .height(290)
        .margins({ top: 10, right: 55, bottom: 30, left: 55 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .colorAccessor(function (d, i){return i;})
        .xUnits(dc.units.ordinal)
        .yAxis().ticks(20);
}

// Moz Rank Chart
function show_moz_rank(ndx) {
    var dim = ndx.dimension(dc.pluck('site'));
    var group = dim.group().reduceSum(dc.pluck('moz_rank'));

    dc.rowChart("#moz-rank")
        .width(400)
        .height(290)
        .margins({ top: 10, right: 55, bottom: 30, left: 55 })
        .dimension(dim)
        .group(group)
        .colors(d3.scale.category20())
        .label(function(d) { return d.key })
        .elasticX(true)
        .ordering(function(d) { return -d.key; })
        .xAxis().ticks(4);
}

// Links Chart
function show_links(ndx) {
    var dim = ndx.dimension(dc.pluck('site'));
    var group = dim.group().reduceSum(dc.pluck('links'));

    dc.pieChart("#links")
        .width(380)
        .height(290)
        .radius(100)
        .innerRadius(30)
        .dimension(dim)
        .group(group)
        .colors(d3.scale.category20())
        .legend(dc.legend())
        .renderLabel(true)
        .ordering(function(d) { return -d.key; })
        .label(function(d) { return d.value });
}

// Equity Links Chart
function show_equity_links(ndx) {
    var dim = ndx.dimension(dc.pluck('site'));
    var group = dim.group().reduceSum(dc.pluck('equity_links'));

    dc.pieChart("#equity-links")
        .width(380)
        .height(290)
        .dimension(dim)
        .radius(100)
        .innerRadius(30)
        .dimension(dim)
        .group(group)
        .colors(d3.scale.category20())
        .legend(dc.legend())
        .renderLabel(true)
        .ordering(function(d) { return -d.key; })
        .label(function(d) { return d.value });
}

// Spam Score Chart
function show_trust_score(ndx) {
    var dim = ndx.dimension(dc.pluck('site'));
    var group = dim.group().reduceSum(dc.pluck('trust_score'));

    dc.rowChart("#trust-score")
        .width(400)
        .height(290)
        .margins({ top: 10, right: 55, bottom: 30, left: 55 })
        .dimension(dim)
        .group(group)
        .colors(d3.scale.category20())
        .label(function(d) { return d.key })
        .title(function(d) { return d.value; })
        .elasticX(true)
        .ordering(function(d) { return -d.key; })
        .xAxis().ticks(4);
}
