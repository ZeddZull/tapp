/*jslint indent: 2, maxerr: 3, nomen: true, maxlen: 80 */
/*global window, rJS, RSVP */
(function (window, rJS, RSVP, URL) {
  "use strict";
// chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
var url_dict = {
  ecurie: new URL("https://ts29.travian.fr/build.php?id=34"),
  caserne: new URL("https://ts29.travian.fr/build.php?id=32"),
  pillage: new URL('https://ts29.travian.fr/build.php?tt=99&id=39'),
  atelier: new URL('https://ts29.travian.fr/build.php?id=37')
},
tp = 6000,
rt = 2000;

function delay(time, range) {
  var time = Math.round(Math.random()*range) + time;
  console.log("Wait For: ", time/1000);
  return RSVP.delay(time)
}

function checkSafe(list) {
  var line = list.querySelectorAll("table tbody tr"), i, check = 0;
  for (i = 0; i < line.length; i+= 1) {
    if (line[i].querySelector('.lastRaid img') &&
      line[i].querySelector('.lastRaid img').getAttribute('alt') !== "Gagné en tant qu'attaquant sans perte.") {
      line[i].querySelector('.checkbox input').click();
      check += 1;
    }
  }
  return delay(300 + check * 500, 1000);
}

function launch(list) {
  var box = list.querySelector('.markAll').querySelector('input.markAll'),
    submit = list.querySelector('button[value="Lancer le pillage"]');
  return RSVP.Queue()
    .push(function () {
      return box.click();
    })
    .push(function () {
      return checkSafe(list);
    })
    .push(function () {
      return submit.click();
    });
}

function launchNatar(list) {
  var box = list.querySelector('.markAll').querySelector('input.markAll'),
    submit = list.querySelector('button[value="Lancer le pillage"]');
  return RSVP.Queue()
    .push(function () {
      return box.click();
    })
    .push(function () {
      return delay(2000, 1000);
    })
    .push(function () {
      return submit.click();
    });
}
  rJS(window)
  .declareMethod("test", function () {
    var gadget = this;
    return gadget.produireCata();
  })
  .declareMethod("selectVillage", function (i) {
    var gadget = this, vivi_list;
    return new RSVP.Queue()
      .push(function () {
        vivi_list = gadget.iframe.contentWindow.document.body.querySelectorAll('#sidebarBoxVillagelist .content ul li');
        vivi_list[i].querySelector('a').click();
        return delay(tp,  rt);
      })
  })
  .declareMethod("produireUnit2", function () {
    var gadget = this;
    return new RSVP.Queue()
      .push(function () {
        gadget.iframe.contentWindow.document.body.querySelectorAll('div.trainUnits div.action')[1].querySelectorAll('div.details a')[2].click();
        return delay(1000,1000);
      })
      .push(function () {
         gadget.iframe.contentWindow.document.body.querySelector('div.build form button[type="submit"]').click();
         return delay(tp,  rt);
       });
  })
  .declareMethod("produireUnit1", function () {
    var gadget = this;
    return new RSVP.Queue()
      .push(function () {
        gadget.iframe.contentWindow.document.body.querySelectorAll('div.trainUnits div.action')[1].querySelectorAll('div.details a')[2].click();
        return delay(1000,1000);
      })
      .push(function () {
         gadget.iframe.contentWindow.document.body.querySelector('div.build form button[type="submit"]').click();
         return delay(tp,  rt);
       });
  })
  .declareMethod("produireDada", function () {
    var gadget = this;
    return new RSVP.Queue()
      .push(function () {
        gadget.iframe.src = url_dict['ecurie'];
        return delay(tp,  rt);
      })
      .push(function () {
        return gadget.selectVillage(0);
      })
      .push(function () {
        return gadget.produireUnit2();
      });
  })
  .declareMethod("produirePieton", function () {
    var gadget = this;
    return new RSVP.Queue()
      .push(function () {
        gadget.iframe.src = url_dict['caserne'];
        return delay(tp,  rt);
      })
      .push(function () {
        return gadget.selectVillage(0);
      })
      .push(function () {
        return gadget.produireUnit1();
      });
  })
  .declareMethod("produireCata", function () {
    var gadget = this;
    return new RSVP.Queue()
      .push(function () {
        gadget.iframe.src = url_dict['atelier'];
        return delay(tp,  rt);
      })
      .push(function () {
        return gadget.produireUnit2();
      });
  })
  .declareMethod("produireBelier", function () {
    var gadget = this;
    return new RSVP.Queue()
      .push(function () {
        gadget.iframe.src = url_dict['atelier'];
        return delay(tp,  rt);
      })
      .push(function () {
        return gadget.produireUnit1();
      });
  })
  .declareMethod("pillagePieton", function () {
    var gadget = this, list;
    return new RSVP.Queue()
      .push(function () {
        gadget.iframe.src = url_dict['pillage'];
        return delay(tp,  rt);
      })
      .push(function () {
        list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
        return launch(list[0]);
      })
      .push(function () {
        return delay(tp,  rt);
      })
      .push(function () {
        list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
        return launch(list[1]);
      })
      .push(function () {
        return delay(tp,  rt);
      })
      .push(function () {
        return delay(3000000, 500000);
      })
      .push(function () {
        return gadget.pillagePieton();
      })
  })
  .declareMethod("pillageAll", function () {
    var gadget = this, list;
    gadget.alt += 1;
    return new RSVP.Queue()
      .push(function () {
        gadget.iframe.src = url_dict['pillage'];
        return delay(tp,  rt);
      })
      .push(function () {
        if (gadget.alt % 4 === 0) {
          list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
          return launchNatar(list[0])
            .push(function () {
              return delay(tp,  rt);
            });
        }
      })
      .push(function () {
        list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
        return launch(list[1]);
      })
      .push(function () {
        return delay(tp,  rt);
      })
      .push(function () {
        list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
        return launch(list[2]);
      })
      .push(function () {
        return delay(tp,  rt);
      })
      .push(function () {
        list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
        return launch(list[3]);
      })
      .push(function () {
        return delay(tp,  rt);
      })
      .push(function () {
        if (gadget.v2) {
          console.log("Pillage v2");
          return new RSVP.Queue()
            .push(function () {
              if (gadget.alt % 4 === 0) {
                list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
                return launchNatar(list[5])
                  .push(function () {
                    return delay(tp,  rt);
                  });
              }
            })
            .push(function () {
              list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
              return launch(list[6])
            })
            .push(function () {
              return delay(tp,  rt);
            })
            .push(function () {
              list = gadget.iframe.contentWindow.document.body.querySelectorAll(".listContent");
              return launch(list[7]);
            })
            .push(function () {
              return delay(tp,  rt);
            });
        }
      });
  })
  .declareMethod("pillage", function () {
    var gadget = this;
    return gadget.pillageAll()
      // .push(function () {
      //   return gadget.selectVillage(0);
      // })
      // .push(function () {
      //   gadget.prod += 1;
      //   if (gadget.prod === 4) {
      //     gadget.prod = 0;
      //     return gadget.produireDada();
      //   }
      // })
      .push(function () {
        console.log("Wait 15 min  ");
        return delay(700000, 400000);
      })
      .push(function () {
        return gadget.pillage();
      })
  })
  .declareMethod("togglePillage", function () {
    this.v2 = !this.v2;
    if (this.v2) {
      this.element.querySelector(".togglePillage").classList.remove("red");
    } else {
      this.element.querySelector(".togglePillage").classList.add("red");
    }
  })
  .declareMethod("action", function (event) {
    var gadget = this;
    switch (event.target.textContent) {
      case "Lancer Pillage":
        return gadget.pillage();
      case "Toggle Pillage v2":
        return gadget.togglePillage();
      case "Produire Pieton":
        return gadget.produirePieton();
      case "Produire Dada":
        return gadget.produireDada();
      case "Pillage SP":
        return gadget.pillageSP();
      case "Test":
        return gadget.test();
    }
  })
  .declareService(function () {
    var gadget = this;
    return new RSVP.Queue()
      .push(function () {
        return delay(4000,  200);
      })
      .push(function () {
        var i;
        gadget.alt = 0;
        gadget.prod = 0;
        gadget.v2 = true;
        gadget.iframe = document.getElementById("main");
        gadget.button_list = gadget.element.querySelectorAll('.action_button');
        for (i = 0; i < gadget.button_list.length; i +=1) {
          gadget.button_list[i].addEventListener('click', function (evt) {
            return gadget.action(evt);
          }, false);
        }
      })
      .push(undefined, function (error) {
        console.log(error);
      });
  });
}(window, rJS, RSVP, URL));
