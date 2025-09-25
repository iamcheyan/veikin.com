<?php include_once('module/header.php'); ?>
<section class="main-img sl-img-play">
	<div class="con">
		<img src="img/v19.jpg" alt="第十九期">
	</div>
</section>
<section class="about">
	<div class="con">
		<h2>[veikin未境]一个活跃于互联网的原创内容提供小组</h2>
		<p>由原[CastleNo.城堡日志]以及[华宴轩文化]与2010年2月重组而成。<br />
			《CastleNo.城堡日志》是一本创刊于2007年8月29日的以提供原创内容为主电子杂志，至今共发行16期，自18期后更名为《veikin未境》。<br />
			[华宴轩文化]是一支于2007年5月建立的网络原创团队，包括《THE WORD》图影电子杂志和华宴轩网络电台。</p>
		<h2>历程</h2>
		<p>原名: CastleNo.城堡日志：<br />
			最初由味道，澈言，熏(Hinoto)，Ingfree，小辛，俞程，安末七人以及Lemon和Subaru两支摄影团队组成。<br />
			2007年10月官方论坛【沐安殿】启动，&quot;沐安&quot;意为&quot;沐浴安详&quot;。<br />
			2010年2月改名为《veikin未境》，名称来自沐安殿成员共同构思，原意Viking维京，北欧海盗。</p>
		<h2>成员组成</h2>
		<p>[veikin未境]的成员分布于世界各地，年龄在13至30岁之间，涵盖了文学、绘画、摄影、音乐、编程、主持、美工等各个方面，相互之间通过网络联系，<br />
			但也有非常多的人在线下成为了很好的朋友以及工作伙伴。</p>
		<h2>投稿&amp;以及加入我们</h2>
		<p>如果您欣赏我们的作品，能够认同我们的努力，那么希望您惠赐稿件或者加入我们。<br />
			请注意，所有稿件版权属于原作者，[veikin未境]只提供一个网络刊载和发声的平台，不许诺提供任何形式的报酬。<br />
			当然，我们也保证不擅自使用您的稿件盈利，如有可盈利的项目合作，我们会同您详细商议并告知稿酬细则，<br />
			我们深知每一份作品都倾注了作者的心血，所以希望您对我们放心。</p>
		<h2>联系我们</h2>
		<p>您可以通过以下方式与我们取得联系：<br>
					杂志部分：<a href="mailto:cheyan@veikin.com">cheyan[at]veikin.com （澈言）</a><br>
					电台部分：<a href="mailto:xiangyi@veikin.com">xiangyi[at]veikin.com （翔翼）</a><br>
					请将[at]替换成@。<br>
					或者您也可以在 <a target="_blank" href="http://bbs.veikin.com">沐安殿</a> 内发帖进行投稿或者询问事宜。</p>
	</div>
</section>
<section class="book">
	<section class="new-book fn-hide">
		<p class="fn-center"> 目前我们共发行了18期电子杂志和一本实体出版物,<br>
			这里展示的是最新的一期:<br>
			<b>《未境第十九期》</b> </p>
		<div class="fn-center"> <img alt="vol.19" src="img/book.jpg"> </div>
	</section>
	<section class="all-book fn-ov">
		<h2>杂志列表</h2>
		<dl class="fn-clear">
			<dt>
				2012 / 未境第十九期
				<i>发行了第一本实体杂志vol.19</i>
			</dt>
			<?php
				$xml = simplexml_load_file('book.xml');
				$item = $xml->xpath('item[@tag="veikin2012"]');
				foreach($item as $row) {
			?>
				<dd>
					<img src="img/0.gif" img-data="img/book/vol<?php echo $vol = $row->vol; ?>.png" />
					<h5>
						<b> VOL.<?php echo $vol = $row->vol; echo " "; echo $name = $row->name; ?></b>
						<span>
							即将发布
						</span>
					</h5>
				</dd>
			<?php
				}
			?>
		</dl>
		<dl class="fn-clear">
			<dt>
				2010 / Veikin 未境 
				<i>本年共发行vol.17 - vol.18两期电子杂志</i>
			</dt>
			<?php
				$item = $xml->xpath('item[@tag="veikin2010"]');
				foreach($item as $row) {
			?>
				<dd>
					<a target="_blank" href="http://dl.veikin.com/book/veikin/vol<?php echo $vol = $row->vol; ?>/" _target="_blank">
						<img src="img/0.gif" img-data="img/book/vol<?php echo $vol = $row->vol; ?>.png" />
					</a>
					<h5>
						<b>VOL.<?php echo $vol; echo " "; echo $name = $row->name; ?></b>
						<span>
							<a target="_blank" href="http://dl.veikin.com/book/veikin/vol<?php echo $vol; ?>/" _target="_blank">线上阅读</a>
							<a href="http://dl.veikin.com/book/veikin/Veikin<?php echo $vol; ?>.exe">下载</a>
						</span>
					</h5>
				</dd>
			<?php
				}
			?>
		</dl>
		<dl class="fn-clear">
			<dt>
				2009 / CastleNo.城堡日志
				<i>本年共发行vol.13 - vol.16四期电子杂志</i>
			</dt>
			<?php
				$item = $xml->xpath('item[@tag="castle2009"]');
				foreach($item as $row) {
			?>
				<dd>
					<a href="http://dl.veikin.com/book/castleno/CastleNo<?php echo $vol = $row->vol; ?>.exe">
						<img src="img/0.gif" img-data="img/book/vol<?php echo $vol = $row->vol; ?>.png" />
					</a>
					<h5>
						<b>VOL.<?php echo $vol; echo " "; echo $name = $row->name; ?></b>
						<span>
							<a href="http://dl.veikin.com/book/castleno/CastleNo<?php echo $vol; ?>.exe">下载</a>
						</span>
					</h5>
				</dd>
			<?php
				}
			?>
		</dl>
		<dl class="fn-clear">
			<dt>
				2007-2008 / CastleNo.城堡日志
				<i>CastleNo.城堡日志第一季全部12期电子杂志</i>
			</dt>
			<?php
				$item = $xml->xpath('item[@tag="castle"]');
				foreach($item as $row) {
			?>
				<dd>
					<a href="http://dl.veikin.com/book/castleno/CastleNo<?php echo $vol = $row->vol; ?>.exe">
						<img src="img/0.gif" img-data="img/book/vol<?php echo $vol = $row->vol; ?>.png" />
					</a>
					<h5>
						<b>VOL.<?php echo $vol; echo " "; echo $name = $row->name; ?></b>
						<span>
							<a href="http://dl.veikin.com/book/castleno/CastleNo<?php echo $vol; ?>.exe">下载</a>
						</span>
					</h5>
				</dd>
			<?php
				}
			?>
		</dl>
	</section>
</section>
<section class="member">
	<h2>成员</h2>
	<div class="fn-clear">
		<?php
			$xml = simplexml_load_file('you.xml');
			$item = $xml->xpath('item');
			shuffle($item);
			foreach($item as $row) {
		?>
		<dl>
			<dt>
				<img src="img/0.gif" img-data="img/you/<?php echo $row->youimg; ?>.png" alt="<?php echo $row->youname; ?>">
			</dt>
			<dd>
				<h5><?php echo $row->youname; ?> - <?php echo $row->youinfor; ?></h5>
			</dd>
		</dl>
		<?php } ?>
	</div>
</section>
<section class="contact">
	<h2>联系我们</h2>
	<p>您可以通过以下方式与我们取得联系：<br>
				杂志部分：<a href="mailto:cheyan@veikin.com">cheyan[at]veikin.com （澈言）</a><br>
				电台部分：<a href="mailto:xiangyi@veikin.com">xiangyi[at]veikin.com （翔翼）</a><br>
				请将[at]替换成@。<br>
				或者您也可以在 <a target="_blank" href="http://bbs.veikin.com">沐安殿</a> 内发帖进行投稿或者询问事宜。</p>
</section>
<?php include_once('module/footer.php'); ?>
</body>
</html>
