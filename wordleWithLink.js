function drawWordle() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var root = d3.select('#renderer')
        .attr('width', width)
        .attr('height', height);

    var maxWords = 20;

    var color = [
        "#891012",
        "#224499",
        "#055108",
        "#992255",
        "#aa4400",
        "#005686",
        "#690069"
    ];

    var colorBlackTheme = [
        "#dc3912",
        "#ff9900",
        "#0099c6",
        "#dd4477",
        "#66aa00",
        "#22aa99",
        "#aaaa11"];


    root.text("한글 테스트")
        .attr('x', 10)
        .attr('y', 10)
        .attr('font-size', 10);


    var fontScale = d3.scale.linear().domain([10, 40]);
    if (width > 960) {
        fontScale.range([18, 48]);
    } else if (width > 580) {
        fontScale.range([12, 36]);
    } else {
        fontScale.range([9, 24]);
    }

    var wordleData = [];
    d3.csv("./data.csv", function (allData) {

        var sizeOfTags = getTagCount(allData, 'tag');
        var data = retRandomSamples(allData, 20);

        _.forEach(allData, function (eachVideoData) {
            wordleData.push({
                text: eachVideoData.title,
                size: (sizeOfTags[eachVideoData['tag']]),
                color: colorBlackTheme[eachVideoData['tag']],
                url: eachVideoData.url
            });
        });

        var cloud = d3.layout.cloud()
            .size([width, height])
            .words(wordleData)
            .rotate(function () {
                return ~~((Math.random() - 0.5 ) * 4) * 25;
            })
            .padding(5)
            .font("Impact")
            .fontSize(function (d) {
                return fontScale(d.size);
            })
            .on("end", draw)
            .start();


        function draw(words) {
            root.attr("class", "wordcloud")
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("font-family", "Impact")
                .style("fill", function (d, i) {
                    return d.color;
                })
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                })
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'center')
                .on("mouseover", function (d, i) {
                    document.body.style.cursor = "pointer";
                    root.append('rect')
                        .attr('x', event.clientX)
                        .attr('y', event.clientY)
                        .attr('width', 160)
                        .attr('height', 30)
                        .attr('fill', '#000')
                        .attr('opacity', 0.75)
                        .attr('rx', 7)
                        .attr('ry', 7)
                        .classed('tooltip', true);

                    root.append('text')
                        .text('Youtube 에서 시청하기')
                        .attr('x', event.clientX + 80)
                        .attr('y', event.clientY + 15)
                        .attr('font-size', 12)
                        .attr('line-height', 30)
                        .attr('text-anchor', 'middle')
                        .attr('alignment-baseline', 'middle')
                        .attr('fill', '#eee')
                        .classed('tooltip', true);

                })
                .on("mouseout", function (d, i) {
                    d3.selectAll('.tooltip').remove();
                })
                .on("click", function (d, i) {
                    window.open(d.url);
                });
        }
    });
}

drawWordle();


function getTagCount(data) {
    var NumberOfAppearancesOfTag = {};
    _.forEach(data, function (eachData) {
        if (!_.has(NumberOfAppearancesOfTag, eachData['tag'])) {
            NumberOfAppearancesOfTag[eachData['tag']] = 0;
        }
        NumberOfAppearancesOfTag[eachData['tag']]++;
    });
    return NumberOfAppearancesOfTag;
}

function retRandomSamples(allData, size) {
    var samples = [];
    for (var i = 0; i < size; i++) {
        var sampleIdx = parseInt(Math.random() * allData.length);
        samples.push(allData[sampleIdx]);
        allData.splice(sampleIdx, 1);
    }
    return samples;
}

window.onresize = function (event) {
    drawWordle();
};