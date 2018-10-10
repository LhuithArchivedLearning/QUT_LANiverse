    $(".panel-collapse").on("hide.bs.collapse", function () {
        $(".panel-collapse-clickable").find('i').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    });

    $(".panel-collapse").on("show.bs.collapse", function () {
        $(".panel-collapse-clickable").find('i').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    });