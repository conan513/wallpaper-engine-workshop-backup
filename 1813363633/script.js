! function ()
{
	"use strict";

	var screen = {
		elem: document.getElementById("screen"),
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		resize: function ()
		{
			var o = screen.elem;
			screen.width = o.offsetWidth;
			screen.height = o.offsetHeight;
			for (screen.left = 0, screen.top = 0; o != null; o = o.offsetParent)
			{
				screen.left += o.offsetLeft;
				screen.top += o.offsetTop;
			}
			screen.elem.width = screen.width;
			screen.elem.height = screen.height;
			if (PHY2D)
			{
				PHY2D.deleteStatic();
				PHY2D.rectangle(screen.width / 2, screen.height + 50, screen.width, 100, 0, 0);
				PHY2D.rectangle(screen.width / 2, -screen.height * 2, screen.width, 100, 0, 0);
				PHY2D.rectangle(-50, 0, 100, screen.height * 4, 0, 0);
				PHY2D.rectangle(screen.width + 50, 0, 100, screen.height * 4, 0, 0);
			}
		}
	}

	screen.elem.onselectstart = function ()
	{
		return false;
	}
	screen.elem.ondrag = function ()
	{
		return false;
	}
	var ctx = screen.elem.getContext("2d");
	window.addEventListener('resize', screen.resize, false);

	var pointer = {
		pos:
		{
			x: 0,
			y: 0
		},
		active: false,
		down: function (e, touch)
		{
			e.preventDefault();
			var p = touch ? e.touches[0] : e;
			(!touch && document.setCapture) && document.setCapture();
			this.pos.x = p.clientX - screen.left;
			this.pos.y = p.clientY - screen.top;
			this.active = true;
		},
		up: function (e, touch)
		{
			e.preventDefault();
			(!touch && document.releaseCapture) && document.releaseCapture();
			this.active = false;
		},
		move: function (e, touch)
		{
			e.preventDefault();
			var p = touch ? e.touches[0] : e;
			if (this.active)
			{
				this.pos.x = p.clientX - screen.left;
				this.pos.y = p.clientY - screen.top;
			}
		}
	}

	if ('ontouchstart' in window)
	{
		screen.elem.ontouchstart = function (e)
		{
			pointer.down(e, true);
		}.bind(pointer);
		screen.elem.ontouchmove = function (e)
		{
			pointer.move(e, true);
		}.bind(pointer);
		screen.elem.ontouchend = function (e)
		{
			pointer.up(e, true);
		}.bind(pointer);
		screen.elem.ontouchcancel = function (e)
		{
			pointer.up(e, true);
		}.bind(pointer);
	}
	document.addEventListener("mousedown", function (e)
	{
		pointer.down(e, false);
	}.bind(pointer), true);
	document.addEventListener("mousemove", function (e)
	{
		pointer.move(e, false);
	}.bind(pointer), true);
	document.addEventListener("mouseup", function (e)
	{
		pointer.up(e, false);
	}.bind(pointer), true);

	function Vector(x, y)
	{
		this.x = x || 0.0;
		this.y = y || 0.0;
	}
	Vector.prototype = {
		set: function (x, y)
		{
			this.x = x;
			this.y = y;
			return this;
		},
		dot: function (v)
		{
			return this.x * v.x + this.y * v.y;
		},
		lenSqr: function ()
		{
			return this.x * this.x + this.y * this.y;
		},
		transform: function (v, m)
		{
			this.x = m.cos * v.x - m.sin * v.y + m.pos.x;
			this.y = m.sin * v.x + m.cos * v.y + m.pos.y;
			return this;
		},
		rotate: function (v, m)
		{
			this.x = m.cos * v.x - m.sin * v.y;
			this.y = m.sin * v.x + m.cos * v.y;
			return this;
		},
		normal: function (a, b)
		{
			var x = a.x - b.x,
				y = a.y - b.y,
				len = Math.sqrt(x * x + y * y);
			this.x = -y / len;
			this.y = x / len;
			return this;
		},
		project: function (a, b, n)
		{
			var x = a.x - b.x,
				y = a.y - b.y,
				len = Math.sqrt(x * x + y * y);
			return (-y / len) * n.x + (x / len) * n.y;
		},
		addScale: function (v1, v2, s)
		{
			this.x = v1.x + (v2.x * s);
			this.y = v1.y + (v2.y * s);
			return this;
		},
		subScale: function (v1, v2, s)
		{
			this.x = v1.x - (v2.x * s);
			this.y = v1.y - (v2.y * s);
			return this;
		},
		add: function (v1, v2)
		{
			this.x = v1.x + v2.x;
			this.y = v1.y + v2.y;
			return this;
		},
		sub: function (v1, v2)
		{
			this.x = v1.x - v2.x;
			this.y = v1.y - v2.y;
			return this;
		},
		scale: function (v1, s)
		{
			this.x = v1.x * s;
			this.y = v1.y * s;
			return this;
		},
		perp: function ()
		{
			var x = this.x;
			this.x = -this.y;
			this.y = x;
			return this;
		},
		inv: function (v1)
		{
			this.x = -v1.x;
			this.y = -v1.y;
			return this;
		},
		clamp: function (v, min, max)
		{
			if (v > max) v = max;
			else if (v < min) v = min;
			return v;
		},
		rotateIntoSpaceOf: function (a, m)
		{
			var dx = -a.x,
				dy = -a.y;
			this.x = dx * m.cos + dy * m.sin;
			this.y = dx * -m.sin + dy * m.cos;
			return this;
		},

		array: function (n, values)
		{
			var array = new Array(n);
			array.min = new Vector();
			array.max = new Vector();
			for (var i = 0; i < n; i++)
			{
				array[i] = new Vector(
					values ? values[i * 2 + 0] : 0.0,
					values ? values[i * 2 + 1] : 0.0
				);
			}
			array.transform = function (v, m)
			{
				for (var i = 0, len = this.length; i < len; i++)
				{
					var vi = v[i],
						elem = this[i];
					var x = m.cos * vi.x - m.sin * vi.y + m.pos.x;
					var y = m.sin * vi.x + m.cos * vi.y + m.pos.y;
					if (x < this.min.x) this.min.x = x;
					if (y < this.min.y) this.min.y = y;
					if (x > this.max.x) this.max.x = x;
					if (y > this.max.y) this.max.y = y;
					elem.x = x;
					elem.y = y;
				}
				return this;
			}
			array.rotate = function (v, m)
			{
				for (var i = 0, len = this.length; i < len; i++)
				{
					var vi = v[i],
						elem = this[i];
					elem.x = m.cos * vi.x - m.sin * vi.y;
					elem.y = m.sin * vi.x + m.cos * vi.y;
				}
				return this;
			}
			array.resetMinmax = function ()
			{
				this.min.x = 100000.0;
				this.min.y = 100000.0;
				this.max.x = -100000.0;
				this.max.y = -100000.0;
			}
			array.normal = function (points)
			{
				for (var i = 0; i < this.length; i++)
				{
					this[i].normal(
						points[(i + 1) % this.length],
						points[i]
					);
				}
				return this;
			}
			return array;
		}
	}

	function Matrix()
	{
		this.cos = 0.0;
		this.sin = 0.0;
		this.pos = new Vector();
		this.ang = 0.0;
	}

	Matrix.prototype = {
		set: function (a, x, y, w, h)
		{
			this.cos = Math.cos(a);
			this.sin = Math.sin(a);
			this.ang = a;
			this.pos.x = x;
			this.pos.y = y;
			this.w = w;
			this.h = h;
			return this;
		},
		copy: function (matrix)
		{
			this.cos = matrix.cos;
			this.sin = matrix.sin;
			this.ang = matrix.ang;
			this.pos.x = matrix.pos.x;
			this.pos.y = matrix.pos.y;
			return this;
		},
		integrate: function (va, vx, vy, kTimeStep)
		{
			this.pos.x += vx * kTimeStep;
			this.pos.y += vy * kTimeStep;
			this.ang += va * kTimeStep;
			this.cos = Math.cos(this.ang);
			this.sin = Math.sin(this.ang);
			return this;
		}
	}

	var PHY2D = function (ctx, pointer, Vector, Matrix)
	{
		var kGravity = 5;
		var kTimeStep = 1 / 60;
		var kFriction = 0.5;
		var objects = [];
		var drag = false;
		var v0 = new Vector();
		var v1 = new Vector();
		var v2 = new Vector();
		var v3 = new Vector();
		var v4 = new Vector();
		var v5 = new Vector();

		var contacts = [];
		contacts.index = 0;
		contacts.create = function (A, B, pa, pb, nx, ny)
		{
			if (!this[this.index]) this[this.index] = new Contact();
			this[this.index++].set(A, B, pa, pb, nx, ny);
		}

		function AABB()
		{
			this.x = 0.0;
			this.y = 0.0;
			this.w = 0.0;
			this.h = 0.0;
		}

		function Polygon(x, y, w, h, vertices, invMass, angle, img)
		{
			this.img = img;
			this.vel = new Vector();
			this.angularVel = 0.0;
			this.invMass = invMass;
			this.matrix = new Matrix().set(angle, x, y, w, h);
			this.aabb = new AABB();
			this.drag = false;
			this.static = false;
			this.length = (vertices.length / 2) | 0;
			this.localSpacePoints = new Vector().array(this.length, vertices);
			this.localSpaceNormals = new Vector().array(this.length).normal(this.localSpacePoints);
			this.worldSpaceNormals = new Vector().array(this.length);
			this.worldSpacePoints = new Vector().array(this.length);
			this.invI = (invMass > 0) ? 1 / ((1 / invMass) * (w * w + h * h) / 3) : 0
			this.c1 = new Vector();
			this.c0 = new Vector();
			objects.push(this);
		}

		Polygon.prototype = {

			motionAABB: function ()
			{
				this.worldSpacePoints.resetMinmax();
				this.worldSpacePoints.transform(this.localSpacePoints, this.matrix);
				this.worldSpaceNormals.rotate(this.localSpaceNormals, this.matrix);
				var min = this.worldSpacePoints.min;
				var max = this.worldSpacePoints.max;
				this.aabb.x = (min.x + max.x) * 0.5;
				this.aabb.y = (min.y + max.y) * 0.5;
				this.aabb.w = (max.x - min.x) * 0.5;
				this.aabb.h = (max.y - min.y) * 0.5;
			},

			contact: function (that)
			{
				var face, vertex, vertexRect, faceRect, fp, va, vb, vc, nx, ny, wsN, wdV0, wdV1, wsV0, wsV1;
				mostSeparated.set(100000, -1, -1, 0, 100000);
				mostPenetrating.set(-100000, -1, -1, 0, 100000);
				this.featurePairJudgement(that, 2);
				that.featurePairJudgement(this, 1);
				
				if (mostSeparated.dist > 0 && mostSeparated.fpc !== 0)
				{
					face = mostSeparated.edge;
					vertex = mostSeparated.closestI;
					fp = mostSeparated.fpc;
				}
				else if (mostPenetrating.dist <= 0)
				{
					face = mostPenetrating.edge;
					vertex = mostPenetrating.closestI;
					fp = mostPenetrating.fpc;
				}
				
				if (fp === 1) vertexRect = this, faceRect = that;
				else vertexRect = that, faceRect = this;
				
				wsN = faceRect.worldSpaceNormals[face];
				va = vertexRect.worldSpacePoints[(vertex - 1 + vertexRect.length) % vertexRect.length];
				vb = vertexRect.worldSpacePoints[vertex];
				vc = vertexRect.worldSpacePoints[(vertex + 1) % vertexRect.length];
				if (v0.project(vb, va, wsN) < v1.project(vc, vb, wsN))
				{
					wdV0 = va;
					wdV1 = vb;
				}
				else
				{
					wdV0 = vb;
					wdV1 = vc;
				}
				wsV0 = faceRect.worldSpacePoints[face];
				wsV1 = faceRect.worldSpacePoints[(face + 1) % faceRect.length];
				if (fp === 1)
				{
					this.projectPointOntoEdge(wsV0, wsV1, wdV0, wdV1);
					that.projectPointOntoEdge(wdV1, wdV0, wsV0, wsV1);
					nx = -wsN.x;
					ny = -wsN.y;
				}
				else
				{
					this.projectPointOntoEdge(wdV1, wdV0, wsV0, wsV1);
					that.projectPointOntoEdge(wsV0, wsV1, wdV0, wdV1);
					nx = wsN.x;
					ny = wsN.y;
				}
				contacts.create(this, that, this.c0, that.c0, nx, ny);
				contacts.create(this, that, this.c1, that.c1, nx, ny);
			},

			featurePairJudgement: function (that, fpc)
			{
				var wsN, closestI, closest, dist;
				for (var edge = 0; edge < this.length; edge++)
				{
					wsN = this.worldSpaceNormals[edge];
					v5.rotateIntoSpaceOf(wsN, that.matrix);
					var closestI = -1,
						closestD = -100000;

					for (var i = 0; i < that.length; i++)
					{
						var d = v5.dot(that.localSpacePoints[i]);
						if (d > closestD)
						{
							closestD = d;
							closestI = i;
						}
					}

					var closest = that.worldSpacePoints[closestI];
					v0.sub(closest, this.worldSpacePoints[edge]);
					var dist = v0.dot(wsN);

					if (dist > 0)
					{
						v1.sub(closest, this.worldSpacePoints[(edge + 1) % this.length]);
						dist = this.projectPointOntoEdgeZero(v0, v1).lenSqr();

						if (dist < mostSeparated.dist)
						{
							mostSeparated.set(dist, closestI, edge, fpc);
						}
					}
					else
					{
						if (dist > mostPenetrating.dist)
						{
							mostPenetrating.set(dist, closestI, edge, fpc);
						}
					}
				}
			},

			projectPointOntoEdge: function (p0, p1, e0, e1)
			{
				var l = v2.sub(e1, e0).lenSqr() + 0.0000001;
				this.c0.addScale(e0, v2, v3.clamp(v3.sub(p0, e0).dot(v2) / l, 0, 1));
				this.c1.addScale(e0, v2, v3.clamp(v3.sub(p1, e0).dot(v2) / l, 0, 1));
			},

			projectPointOntoEdgeZero: function (e0, e1)
			{
				var l = v2.sub(e1, e0).lenSqr() + 0.0000001;
				return this.c0.addScale(e0, v2, v3.clamp(v3.inv(e0).dot(v2) / l, 0, 1));
			},

			integrate: function ()
			{
				if (this.drag)
				{
					this.vel.x += (pointer.pos.x - this.matrix.pos.x);
					this.vel.y += (pointer.pos.y - this.matrix.pos.y);
				}
				else
				{
					if (this.invMass > 0) this.vel.y += kGravity;
				}

				this.matrix.integrate(this.angularVel, this.vel.x, this.vel.y, kTimeStep);

				if (!this.static) this.motionAABB();
				else
				{
					if (this.invMass === 0)
					{
						this.static = true;
						this.motionAABB();
					}
				}
			},

			draw: function ()
			{
				if (this.img)
				{
					var m = this.matrix;
					ctx.save();
					ctx.translate(m.pos.x, m.pos.y);
					ctx.rotate(m.ang);
					ctx.drawImage(this.img, -m.w * 0.5, -m.h * 0.5, m.w, m.h);
					ctx.restore();

					if (pointer.active)
					{
						if (!drag && this.invMass)
						{
							ctx.beginPath();
							for (var j = 0; j < this.length; j++)
							{
								var a = this.worldSpacePoints[j];
								ctx.lineTo(a.x, a.y);
							}
							ctx.closePath();
							if (ctx.isPointInPath(pointer.pos.x, pointer.pos.y))
							{
								this.drag = true;
								drag = true;
							}
						}
					}
					else
					{
						if (drag)
						{
							for (var i = 0; i < objects.length; i++) objects[i].drag = false;
							drag = false;
						}
					}
				}
			}
		}

		function FeaturePair()
		{
			this.dist = 0;
			this.closestI = 0;
			this.edge = 0;
			this.fpc = 0;
		}

		FeaturePair.prototype.set = function (dist, closestI, edge, fpc)
		{
			this.dist = dist;
			this.closestI = closestI;
			this.edge = edge;
			this.fpc = fpc;
		}

		var mostSeparated = new FeaturePair();
		var mostPenetrating = new FeaturePair();

		function Contact()
		{
			this.a = null;
			this.b = null;
			this.normal = new Vector();
			this.normalPerp = new Vector();
			this.ra = new Vector();
			this.rb = new Vector();
			this.dist = 0;
			this.impulseN = 0;
			this.impulseT = 0;
			this.invDenom = 0;
			this.invDenomTan = 0;
		}

		Contact.prototype = {

			set: function (A, B, pa, pb, nx, ny)
			{
				var ran, rbn;
				this.a = A;
				this.b = B;
				this.normal.set(nx, ny);
				this.normalPerp.set(-ny, nx);
				this.dist = v1.sub(pb, pa).dot(this.normal);
				this.impulseN = 0;
				this.impulseT = 0;
				this.ra.sub(pa, A.matrix.pos).perp();
				this.rb.sub(pb, B.matrix.pos).perp();
				ran = this.ra.dot(this.normal);
				rbn = this.rb.dot(this.normal);
				this.invDenom = 1 / (A.invMass + B.invMass + (ran * ran * A.invI) + (rbn * rbn * B.invI));
				ran = this.ra.dot(this.normalPerp);
				rbn = this.rb.dot(this.normalPerp);
				this.invDenomTan = 1 / (A.invMass + B.invMass + (ran * ran * A.invI) + (rbn * rbn * B.invI));
			},

			applyImpulse: function (imp)
			{

				this.a.vel.addScale(this.a.vel, imp, this.a.invMass);
				this.b.vel.subScale(this.b.vel, imp, this.b.invMass);

				this.a.angularVel += imp.dot(this.ra) * this.a.invI;
				this.b.angularVel -= imp.dot(this.rb) * this.b.invI;
			},

			solve: function ()
			{
				var newImpulse, absMag, dv = v1;

				dv.sub(
					v2.addScale(this.b.vel, this.rb, this.b.angularVel),
					v3.addScale(this.a.vel, this.ra, this.a.angularVel)
				);

				newImpulse = (dv.dot(this.normal) + this.dist / kTimeStep) * this.invDenom + this.impulseN;
				if (newImpulse > 0) newImpulse = 0;
				this.applyImpulse(v2.scale(this.normal, newImpulse - this.impulseN));
				this.impulseN = newImpulse;

				absMag = Math.abs(this.impulseN) * kFriction;
				newImpulse = v2.clamp(dv.dot(this.normalPerp) * this.invDenomTan + this.impulseT, -absMag, absMag);
				this.applyImpulse(v3.scale(this.normalPerp, newImpulse - this.impulseT));
				this.impulseT = newImpulse;
			}
		}

		function render()
		{
			contacts.index = 0;
			for (var i = 0, len = objects.length; i < len - 1; i++)
			{
				var A = objects[i];
				for (var j = i + 1; j < len; j++)
				{
					var B = objects[j];
					if (A.invMass || B.invMass)
					{
						var a = A.aabb,
							b = B.aabb;
						if (
							Math.abs(b.x - a.x) - (a.w + b.w) < 0 &&
							Math.abs(b.y - a.y) - (a.h + b.h) < 0
						) A.contact(B);
					}

				}
			}

			var len = contacts.index;

			for (var j = 0; j < 5; j++)
			{
				for (var i = 0; i < len; i++)
				{
					contacts[i].solve();
				}
			}

			for (var i = 0, len = objects.length; i < len; i++)
			{
				objects[i].integrate();
			}

			for (var i = 0; i < len; i++)
			{
				var rb = objects[i];
				rb.draw();

			}
		}

		return {

			render: render,

			rectangle: function (x, y, w, h, mass, angle, img)
			{
				var vertices = [
					w / 2, -h / 2, -w / 2, -h / 2, -w / 2, h / 2,
					w / 2, h / 2
				];

				var invMass = mass ? 1 / mass : 0;
				return new Polygon(x, y, w, h, vertices, invMass, angle, img);
			},

			deleteStatic: function ()
			{
				var k = objects.length;
				while (k--)
				{

					var p = objects[k];
					if (!p.invMass) objects.splice(k, 1);

				}
			},

			number: function (w, h, text)
			{
				var img = document.createElement("canvas");
				var context = img.getContext("2d");
				img.width = w;
				img.height = h;
				context.font = "bold " + (w * 0.92) + "px arial";
				context.fillStyle = hsl;
				context.fillText(text, 0, h * 0.97);
				return img;
			},

			delete: function (object)
			{
				for (var i = 0, len = objects.length; i < len; i++)
				{

					if (objects[i] === object)
					{
						objects.splice(i, 1);
						return;
					}

				}
			}
		}
	}(ctx, pointer, Vector, Matrix);

	screen.resize();

	function n(n)
	{
		return n > 9 ? "" + n : "0" + n;
	}

	var hb = "",
		mb = "",
		hsl = "",
		hue = 0,
		lum = 0,
		xp = 0;
	var hour, minut, seconds = [];

	function addNumber(w, x, t, m, a)
	{
		var h = (w * 0.69) | 0;
		var img = PHY2D.number(w, h, t);
		return PHY2D.rectangle(x, -w, w, h, m, a, img);

	}

	function toc()
	{

		var t = new Date(),
			hr = n(t.getHours()),
			mn = n(t.getMinutes()),
			sc = n(t.getSeconds()),
			w, h, img, sec;

		if (hr != hb)
		{
			hue = (Math.random() * 360) | 0;
			hsl = "hsl(" + hue + ", 70%, 80%)";
			w = (screen.width / 3) | 0;
			PHY2D.delete(hour);
			hour = addNumber(w, w * 1.2, hr, 1, 0);
			hb = hr;
		}

		if (mn != mb)
		{
			hue = (Math.random() * 360) | 0;
			hsl = "hsl(" + hue + ", 70%, 60%)";

			w = (screen.width / 3) | 0;
			h = (w * 0.69) | 0;
			img = PHY2D.number(w, h, hr);
			hour.img = img;

			w = (screen.width / 5) | 0;
			PHY2D.delete(minut);
			minut = addNumber(w, screen.width - w * 1.2, mn, 1, 0);
			mb = mn;

			for (var i = 0; i < seconds.length; i++)
			{
				setTimeout(function ()
				{
					PHY2D.delete(seconds.shift());
				}, i * 60)
			}
			xp = 0;
		}

		hsl = "hsl(" + hue + ",70%," + ((20 + Math.random() * 80) | 0) + "%)";
		w = (screen.width / 15) | 0;
		sec = addNumber(w, w + (xp * w) % (screen.width - (w * 2)), sc, 0.1, Math.random() * 2 * Math.PI);
		seconds.push(sec);
		xp++;
	}

	toc();
	setInterval(toc, 1000);

	function run()
	{
		requestAnimationFrame(run);
		ctx.clearRect(0, 0, screen.width, screen.height);
		PHY2D.render();

	}

	requestAnimationFrame(run);

}();