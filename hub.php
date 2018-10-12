<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, height=device-height">
	<meta name="description" content="Eugene Martens Portfolio">
	<meta name="keywords" content="Eugene Martens, Portfolio, software development, web desighn, game development, programming">
	<meta name="author" content="Eugene Martens">
	<link rel="shortcut icon" type="image/png" href="img/Icons/favicon.ico">

	<title>Gene Space | Oh Hey</title>
	<link rel="stylesheet" href="./css/style.css">
	<script>
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date(); a = s.createElement(o),
				m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		ga('create', 'UA-104121571-1', 'auto');
		ga('send', 'pageview');



	</script>
	

	<!-- Three JS -->
	<script type="text/javascript" src="js/THREE/three.min.js"></script>

	<script type="text/javascript" src="js/THREE/CanvasRenderer.js"></script>
	<script type="text/javascript" src="js/THREE/OrbitControls.js"></script>
	<script type="text/javascript" src="js/THREE/WorldData.js"></script>
	<script type="text/javascript" src="js/THREE/Gyroscope.js"></script>
	<script type="text/javascript" src="js/THREE/OBJLoader.js"></script>
	<script type="text/javascript" src="js/THREE/OBJExporter.js"></script>

	<!--Post Processing Stuff -->
	<script type="text/javascript" src="js/THREE/EffectComposer.js"></script>
	<script type="text/javascript" src="js/THREE/RenderPass.js"></script>
	<script type="text/javascript" src="js/THREE/CopyShader.js"></script>
	<script type="text/javascript" src="js/THREE/ShaderPass.js"></script>

	<script type="text/javascript" src="js/Shaders/Planet/DitherParameters.js"></script>
	<script type="text/javascript" src="js/Helpers/ColorPalletes.js"></script>

	<!--Helpers -->
	<script type="text/javascript" src="js/Helpers/perlin.js"></script>
	<script type="text/javascript" src="js/Helpers/Vector2.js"></script>
	<script type="text/javascript" src="js/Helpers/MathUtils.js"></script>
	<script type="text/javascript" src="js/Helpers/OrbitUtils.js"></script>
	<script type="text/javascript" src="js/Helpers/PlanetInfo.js"></script>
	<script type="text/javascript" src="js/Loaders.js"></script>
	<script type="text/javascript" src="js/LaberGenerator.js"></script>
	<script type="text/javascript" src="js/GibbirishGenerator.js"></script>

	<!-- World Generator -->
	<script type="text/javascript" src="js/WorldGenerator/FallOffGenerator.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/MapGenerator.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/Noise1D.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/Noise2D.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/NoiseFromTexture.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/Regions.js"></script>
	<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
</head>

<body>
	<div class="wrapper">
		<div id="webGL-container">
			<div id="heading-Container" class="w-100">
			</div>
			<div class="t-0 section group top-override ">
				<li id="UI-Tools-List" class="flex f-l"><img id="map"></li>
			</div>
			<!-- Main -->
			<div id="heading-Container" class="w-100">
				<h1>
					<a class="heading">
						<span class="highlight">LAN</span>-iverse </a>
				</h1>
			</div>
			<!-- Main -->
			<script type="text/javascript" src="js/hub.js"></script>
			<!-- <a class="heading" href="index.html"><h1><span class="highlight">Gene</span> Space</h1></a> -->
			<img id="i">
		</div>
	</div>
	<footer id ="foot" class="page-footer gold footer-body padding-10 ">
	    <h6 class="t-align-c" id='echo'><?php include ('database.php');?> </h6>
		<h6 class="t-align-c">Created using THREE.js </h6>
	</footer>
</body>

</html>