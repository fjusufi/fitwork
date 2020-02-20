    var slotDuration = '00:30:00';
    var start_cal_at, end_cal_at;
    var show_times = {}

    $(function() {
        $('.print-link').on('click', function(e){
            e.preventDefault();
            var original_url = $('.print-link').attr('href');
            var url = ''

            if ('' != ''){
                if (original_url.indexOf('?') > -1) {
                    url = original_url + '&start=' + moment($('#course_calendar').fullCalendar('getView').intervalStart).startOf('day').unix() + '&end=' + moment($('#course_calendar').fullCalendar('getView').intervalEnd).startOf('day').unix() + '&location_id=' + '';
                }else {
                    url = original_url + '?start=' + moment($('#course_calendar').fullCalendar('getView').intervalStart).startOf('day').unix() + '&end=' + moment($('#course_calendar').fullCalendar('getView').intervalEnd).startOf('day').unix() + '&location_id=' + '';
                }
            }else {
                if (original_url.indexOf('?') > -1) {
                    url = original_url + '&start=' + moment($('#course_calendar').fullCalendar('getView').intervalStart).startOf('day').unix() + '&end=' + moment($('#course_calendar').fullCalendar('getView').intervalEnd).startOf('day').unix();
                }else {
                    url = original_url + '?start=' + moment($('#course_calendar').fullCalendar('getView').intervalStart).startOf('day').unix() + '&end=' + moment($('#course_calendar').fullCalendar('getView').intervalEnd).startOf('day').unix();
                }
            }

            window.open(url, '_blank');
        });

        function renderCalendar(view) {
            /* Close Popup - Click on x */
            $(".close_popup").click(function(){
                $(".fullcalendar_popup").fadeOut(400);
            });

            /* Close Popup - Click anywhere */
            $(document).click(function(e){
                if (!$(".fullcalendar_popup").hasClass("fading") && ($(e.target).attr("class") != "fc-bg")){
                    $(".fullcalendar_popup").fadeOut(400);
                }
            });

            $(".course_categories li").click(function(){
                var cat_id = ($(this).attr("data-category-id") != 'reset') ? $(this).attr("data-category-id") : '';

                $('.print-link').attr('href', function(i, h) {
                    if ($.urlParam('room', h) != null) {
                        h = h.replace($.urlParam('room', h), '').replace('?room=', '').replace('&room=', '')
                    }

                    if ($.urlParam('category', h) == null) {
                        h = h + (h.indexOf('?') != -1 ? "&category="+cat_id : "?category="+cat_id);
                    }else if ($.urlParam('category', h) != cat_id && cat_id != '') {
                        h = h.replace($.urlParam('category', h), cat_id);
                    }else {
                        h = h.replace($.urlParam('category', h), '').replace('?category=', '').replace('&category=', '');
                    }

                    return h;
                });

                $(".course_categories li").removeClass("active-category");
                $(this).addClass("active-category");

                $('.detail_info_room_category').html(" " + $(this).attr("data-category-name"));

                $.ajax({
                    method: "GET",
                    url: "courses/courses_ajax",
                    data: { category: cat_id, location_id: '' },
                    success: function(response){
                        $('#course_calendar').fullCalendar('removeEvents');
                        $('#course_calendar').fullCalendar('addEventSource', response);
                        $('#course_calendar').fullCalendar('rerenderEvents');
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log("Status: " + textStatus + "Error: " + errorThrown);
                    }
                });

                $(".room_info_above").html('');
                $(".room_info_after").html('');

            });

            $(".course_rooms_dropdown li a").click(function (e) {
                e.preventDefault();
                var room_id = ($(this).parent().attr("data-room-id") != 'reset') ? $(this).parent().attr("data-room-id") : '';

                $('.print-link').attr('href', function(i, h) {

                    if ($.urlParam('category', h) != null) {
                        h = h.replace($.urlParam('category', h), '').replace('?category=', '').replace('&category=', '')
                    }

                    if ($.urlParam('room', h) == null) {
                        return h + (h.indexOf('?') != -1 ? "&room="+room_id : "?room="+room_id);
                    }else if ($.urlParam('room', h) != room_id) {
                        return h.replace($.urlParam('room', h), room_id);
                    }else {
                        return h.replace($.urlParam('room', h), '').replace('?room=', '').replace('&room=', '');
                    }
                });

                $(".course_categories li").removeClass("active-category");
                $(".course_categories li").first().addClass("active-category");

                $('.detail_info_room_category').html(" " + $(this).parent().attr("data-room-name"));

                /* Courses */
                $.ajax({
                    method: "GET",
                    url: "courses/courses_ajax",
                    data: { room: room_id, location_id: '' },
                    success: function(response){
                        $('#course_calendar').fullCalendar('removeEvents');
                        $('#course_calendar').fullCalendar('addEventSource', response);
                        $('#course_calendar').fullCalendar('rerenderEvents');
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log("Status: " + textStatus + "Error: " + errorThrown);
                    }
                });

                /* Room Info */
                if (room_id != '') {
                    $.ajax({
                        method: "GET",
                        url: "courses/room_info_ajax",
                        data: { room: room_id },
                        success: function(response){
                            $(".room_info_above").html(response.text_before);
                            $(".room_info_after").html(response.text_after);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log("Status: " + textStatus + "Error: " + errorThrown);
                        }
                    });
                }else {
                    $(".room_info_above").html('');
                    $(".room_info_after").html('');
                }
            });

            var currentLangCode = LANGUAGE;
            var min_date = moment("2015-01-05").format('DD.MM.YYYY');
            var max_date = moment("2015-01-11").format('DD.MM.YYYY');
            var cal_start, cal_end;

            var courses_initial = [{"locale":"de","title":"Cycling ","css_class":"cycling kursraum-ug","highlight_id":"cycling","blendout_id":"_gup0137cf8bk3330k4218k9558k19b06d229841","id":"_gup0492e18bk846ek4913kb9b6kc783e40099e8","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T12:10:00","end":"2015-01-05T13:00:00","backgroundColor":"#ac0e0e","borderColor":"#ac0e0e","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/indoorcycling/s/indoor_cycling11.jpg' alt='Cycling ' title='Cycling ' /\u003e","teaser_text":"Animierendes Cycling-Training im Intervallformat","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/cycling-kursraum-ug-mon-12-10-13-00-0.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"09.07.2018,16.07.2018,23.07.2018,30.07.2018,06.08.2018,13.08.2018,24.12.2018,31.12.2018,04.03.2019,22.04.2019,10.06.2019,08.07.2019,15.07.2019,22.07.2019,29.07.2019,05.08.2019,12.08.2019,19.08.2019,26.08.2019","start_time":"12:10","end_time":"13:00"},{"locale":"de","title":"Five","css_class":"five kursraum-ug","highlight_id":"five","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gupc54746bdka9d3k4211k83afk0adabbf7d136","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T19:00:00","end":"2015-01-05T19:45:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining62.jpg' alt='Five' title='Five' /\u003e","teaser_text":"Rumpftraining, welches sowohl Übungen für einen starken Rücken sowie Bauch \u0026amp; Beckenboden beinhaltet.","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/five-kursraum-ug-mon-19-00-19-45.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"05.06.2017,25.12.2017,01.01.2018,12.02.2018,02.04.2018,21.05.2018,24.12.2018,31.12.2018,04.03.2019,22.04.2019,10.06.2019","start_time":"19:00","end_time":"19:45"},{"locale":"de","title":"Painlessmotion (neu)","css_class":"painlessmotion kursraum-ug","highlight_id":"painlessmotion","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup31a188d3kccbfk4f34kbefdkab256094d9fe","day":"Tue","editable":false,"day_text":"Dienstag","start":"2015-01-06T08:00:00","end":"2015-01-06T09:00:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining14.jpg' alt='Painlessmotion' title='Painlessmotion' /\u003e","teaser_text":"Beweglichkeitstraining nach Phil.Dr. Axel Daase","trainer":"","level":"","icons":"","new":1,"canceled":0,"url_slug":"kurse/painlessmotion-kursraum-ug-tue-08-00-09-00-0.html","page_linked_url":"","dow":[2],"day_integer":2,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2017,26.12.2017,02.01.2018,13.02.2018,25.12.2018,01.01.2019,05.03.2019,31.12.2019","start_time":"08:00","end_time":"09:00"},{"locale":"de","title":"Fit \u0026 Zwäg","css_class":"fit-zwag kursraum-ug","highlight_id":"fit-zwag","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup9aa3dee4k7021k4090k8963k2ebbcdd8bf81","day":"Tue","editable":false,"day_text":"Dienstag","start":"2015-01-06T09:00:00","end":"2015-01-06T10:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining26.jpg' alt='Fit \u0026 Zwäg' title='Fit \u0026 Zwäg' /\u003e","teaser_text":"Das optimale Ganzkörperworkout","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/fit-zwag-kursraum-ug-tue-09-00-10-00-0.html","page_linked_url":"","dow":[2],"day_integer":2,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"03.04.2018,10.04.2018,10.07.2018,17.07.2018,24.07.2018,31.07.2018,07.08.2018,14.08.2018,25.12.2018,05.02.2019,26.02.2019,05.03.2019,09.07.2019,16.07.2019,23.07.2019,30.07.2019,06.08.2019,13.08.2019,01.10.2019,08.10.2019,31.12.2019","start_time":"09:00","end_time":"10:00"},{"locale":"de","title":"Pilates","css_class":"pilates kursraum-ug","highlight_id":"pilates","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup1b4040f1k513fk4c48k97ffk506580a5eef2","day":"Tue","editable":false,"day_text":"Dienstag","start":"2015-01-06T10:00:00","end":"2015-01-06T11:00:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/pilates/s/pilates01.jpg' alt='Pilates' title='Pilates' /\u003e","teaser_text":"Ein ganzheitliches Körpertraining","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/pilates-kursraum-ug-tue-10-00-11-00-0.html","page_linked_url":"","dow":[2],"day_integer":2,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2017,26.12.2017,02.01.2018,13.02.2018,25.12.2018,01.01.2019,05.03.2019,24.12.2019,31.12.2019","start_time":"10:00","end_time":"11:00"},{"locale":"de","title":"Bauchintensiv","css_class":"bauchintensiv kursraum-ug","highlight_id":"bauchintensiv","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup007e1708kdd8ek4f65kabdbk5a301b78fd69","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T08:45:00","end":"2015-01-07T09:15:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining44.jpg' alt='Bauchintensiv' title='Bauchintensiv' /\u003e","teaser_text":"30 Minuten für den Rumpf. Hol dir dein Sixpack und funktionelle Kraft für Sport und Alltag.","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bauchintensiv-kursraum-ug-wed-08-45-09-15-0.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.11.2017,01.08.2018,15.08.2018,26.12.2018,02.01.2019,25.12.2019,01.01.2020","start_time":"08:45","end_time":"09:15"},{"locale":"de","title":"M.A.X./Toning","css_class":"m-a-x-toning kursraum-ug","highlight_id":"m-a-x-toning","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupfc13e7b1kf798k4722k9bb0kd10d7fe87ec3","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T09:15:00","end":"2015-01-07T10:15:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/figur/s/figur13.jpg' alt='M.A.X./Toning' title='M.A.X./Toning' /\u003e","teaser_text":"Der ganze Körper wird gekräftigt und gestrafft mit diversen Hilfsmitteln.","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"https://fitwork.webflow.io/kurse/m-a-x-toning-kursraum-ug-wed-09-15-10-15-0","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.11.2017,01.08.2018,15.08.2018,25.12.2019,01.01.2020","start_time":"09:15","end_time":"10:15"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup1723c04akcd0fk44d8k8163k3ddf1be17228","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T18:00:00","end":"2015-01-07T19:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-wed-18-00-19-00.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2018,15.08.2018,26.12.2018,02.01.2019,25.12.2019,01.01.2020","start_time":"18:00","end_time":"19:00"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupa5f7d331k2970k4d96kaf82k9428222c83c3","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2015-01-08T09:00:00","end":"2015-01-08T10:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining80.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-thu-09-00-10-00.html","page_linked_url":"","dow":[4],"day_integer":4,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"30.05.2019,20.06.2019,01.08.2019,15.08.2019,26.12.2019,02.01.2020","start_time":"09:00","end_time":"10:00"},{"locale":"de","title":"Five","css_class":"five kursraum-ug","highlight_id":"five","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup415df499k8e04k4a2ak8a4ekc1e5ef966131","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2015-01-08T10:00:00","end":"2015-01-08T10:45:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining45.jpg' alt='Five' title='Five' /\u003e","teaser_text":"Das optimale Ganzkörperworkout","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/five-kursraum-ug-thu-10-00-10-45.html","page_linked_url":"","dow":[4],"day_integer":4,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"30.05.2019,20.06.2019,01.08.2019,15.08.2019,26.09.2019,26.12.2019,02.01.2020","start_time":"10:00","end_time":"10:45"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup9950b47ck8033k4d62kabc7k0c77ad3e7c90","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2015-01-08T12:10:00","end":"2015-01-08T13:10:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-thu-12-10-13-10-0.html","page_linked_url":"","dow":[4],"day_integer":4,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"30.05.2019,20.06.2019,01.08.2019,15.08.2019,26.12.2019,02.01.2020","start_time":"12:10","end_time":"13:10"},{"locale":"de","title":"Body \u0026 Soul","css_class":"body-soul kursraum-ug","highlight_id":"body-soul","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gupf59843ack12eek4dadkaa12k2fbc433dc06b","day":"Fri","editable":false,"day_text":"Freitag","start":"2015-01-09T09:00:00","end":"2015-01-09T10:00:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining38.jpg' alt='Body \u0026 Soul' title='Body \u0026 Soul' /\u003e","teaser_text":"Yoga, Pilates, Tai Chi und Stretching BodyBALANCE bringt Atmung, Bewegung, Anspannung und Entspannung.","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/body-soul-kursraum-ug-fri-09-00-10-00.html","page_linked_url":"","dow":[5],"day_integer":5,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"14.04.2017,30.03.2018,19.04.2019","start_time":"09:00","end_time":"10:00"},{"locale":"de","title":"Five","css_class":"five kursraum-eg","highlight_id":"five","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gupe66bddc7k8959k4f66k8aa8k710406478613","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T18:00:00","end":"2015-01-07T18:45:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining09.jpg' alt='Five' title='Five' /\u003e","teaser_text":"Das optimale Ganzkörperworkout","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/five-kursraum-eg-wed-18-00-18-45-0.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2018,15.08.2018,26.12.2018,02.01.2019,25.12.2019,01.01.2020","start_time":"18:00","end_time":"18:45"},{"locale":"de","title":"Painlessmotion (neu)","css_class":"painlessmotion kursraum-eg","highlight_id":"painlessmotion","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup71b4aac6k6891k4f3bk8f02k820fd4f8c0f6","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2015-01-08T19:00:00","end":"2015-01-08T19:45:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining38.jpg' alt='Painlessmotion' title='Painlessmotion' /\u003e","teaser_text":"Das optimale Ganzkörperworkout","trainer":"","level":"","icons":"","new":1,"canceled":0,"url_slug":"kurse/painlessmotion-kursraum-eg-thu-19-00-19-45-0.html","page_linked_url":"","dow":[4],"day_integer":4,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"30.05.2019,20.06.2019,01.08.2019,15.08.2019,26.09.2019,02.01.2020,06.02.2020,26.12.2019","start_time":"19:00","end_time":"19:45"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupfe6744b6k8bd5k4822kbd88kf0e361c63c11","day":"Sat","editable":false,"day_text":"Samstag","start":"2015-01-10T09:15:00","end":"2015-01-10T10:15:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining80.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-sat-09-15-10-15.html","page_linked_url":null,"dow":[6],"day_integer":6,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":0,"excluded_dates":"","start_time":"09:15","end_time":"10:15"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup0aac10a3kff32k4ef7kba89k498e13e11e64","day":"Sun","editable":false,"day_text":"Sonntag","start":"2015-01-11T10:00:00","end":"2015-01-11T11:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-sun-10-00-11-00.html","page_linked_url":"","dow":[0],"day_integer":0,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"21.04.2019,09.06.2019","start_time":"10:00","end_time":"11:00"},{"locale":"de","title":"CXWorx/Toning","css_class":"cxworx-toning kursraum-eg","highlight_id":"cxworx-toning","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupafddc02dk29edk4cc7ka0f3k1f108a2afe88","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T18:00:00","end":"2015-01-05T19:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining41.jpg' alt='CXWorx/Toning' title='CXWorx/Toning' /\u003e","teaser_text":"Ganz Körpertraining","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/cxworx-toning-kursraum-eg-mon-18-00-19-00-0.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"25.12.2017,01.01.2018,12.02.2018,02.04.2018,21.05.2018,24.12.2018,31.12.2018,04.03.2019,22.04.2019,10.06.2019,08.07.2019,15.07.2019,22.07.2019,29.07.2019,05.08.2019,12.08.2019","start_time":"18:00","end_time":"19:00"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup1bca3715k70a8k4b8fk9180kf0b6168dd350","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T09:00:00","end":"2015-01-05T10:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-mon-09-00-10-00.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"04.03.2019,22.04.2019,10.06.2019","start_time":"09:00","end_time":"10:00"},{"locale":"de","title":"special","css_class":"special kursraum-ug","highlight_id":"special","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupb91757a4kd4dek4ab6k898fk3db1fc3f31c3","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2020-01-02T09:30:00","end":"2020-01-02T11:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='special' title='special' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/special-kursraum-ug-thu-09-30-11-00-0.html","page_linked_url":"","dow":"","day_integer":4,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":0,"excluded_dates":"","start_time":"09:30","end_time":"11:00"},{"locale":"de","title":"Yoga","css_class":"yoga kursraum-eg","highlight_id":"yoga","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup959ae473kab73k4e08kb672kbcee61fd408c","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T19:00:00","end":"2015-01-07T20:15:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/xs/gruppentraining09.jpg' alt='Yoga' title='Yoga' /\u003e","teaser_text":"Yoga (Bhaktiyoga)\r\nRichtig beigebrachte Ananas (Körperübungen) führen kurz- und langfristig zu mehr Vitalität, Fitness und Gesundheit auf körperlicher sowie geistiger Ebene.","trainer":"Martina","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/yoga-kursraum-eg-wed-19-00-20-15.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2018,15.08.2018,26.12.2018,02.01.2019,25.12.2019,01.01.2020","start_time":"19:00","end_time":"20:15"},{"locale":"de","title":"Cycling ","css_class":"cycling kursraum-ug","highlight_id":"cycling","blendout_id":"_gup0137cf8bk3330k4218k9558k19b06d229841","id":"_gup67865b58k18a6k49c4kbecek2f7357b198f9","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T18:00:00","end":"2015-01-05T18:45:00","backgroundColor":"#ac0e0e","borderColor":"#ac0e0e","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/indoorcycling/s/indoor_cycling11.jpg' alt='Cycling ' title='Cycling ' /\u003e","teaser_text":"Animierendes Cycling-Training im Intervallformat","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/cycling-kursraum-ug-mon-18-00-18-45-0.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"21.05.2018,09.07.2018,16.07.2018,23.07.2018,30.07.2018,06.08.2018,13.08.2018,31.12.2018,24.12.2018,04.03.2019,22.04.2019,10.06.2019,08.07.2019,15.07.2019,22.07.2019,29.07.2019,05.08.2019,12.08.2019,19.08.2019,26.08.2019","start_time":"18:00","end_time":"18:45"},{"locale":"de","title":"Yoga","css_class":"yoga kursraum-eg","highlight_id":"yoga","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup17069246k330ek478dka091k08d7d24215f7","day":"Fri","editable":false,"day_text":"Freitag","start":"2015-01-09T12:10:00","end":"2015-01-09T13:05:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/xs/gruppentraining09.jpg' alt='Yoga' title='Yoga' /\u003e","teaser_text":"Yoga (Bhaktiyoga)\r\nRichtig beigebrachte Ananas (Körperübungen) führen kurz- und langfristig zu mehr Vitalität, Fitness und Gesundheit auf körperlicher sowie geistiger Ebene.","trainer":"Martina","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/yoga-kursraum-eg-fri-12-10-13-05-0.html","page_linked_url":"","dow":[5],"day_integer":5,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"13.12.2018,28.12.2018,04.01.2019,01.03.2019,19.04.2019,03.01.2020","start_time":"12:10","end_time":"13:05"},{"locale":"de","title":"CXWorx (neu)","css_class":"cxworx kursraum-ug","highlight_id":"cxworx","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup5b466b0ak30e6k403eka1fdk3da866903f8b","day":"Tue","editable":false,"day_text":"Dienstag","start":"2015-01-06T18:00:00","end":"2015-01-06T18:30:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining44.jpg' alt='CXWorx' title='CXWorx' /\u003e","teaser_text":"30 Minuten für den Rumpf. Hol dir dein Sixpack und funktionelle Kraft für Sport und Alltag.","trainer":"","level":"","icons":"","new":1,"canceled":0,"url_slug":"kurse/cxworx-kursraum-ug-tue-18-00-18-30-0.html","page_linked_url":"","dow":[2],"day_integer":2,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"05.03.2019,22.10.2019,24.12.2019,31.12.2019","start_time":"18:00","end_time":"18:30"},{"locale":"de","title":"BodyPump (neu)","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupe216c2cck2781k4524k9476kff0839c77c24","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T19:00:00","end":"2015-01-05T20:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":1,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-mon-19-00-20-00-0.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"04.03.2019,22.04.2019,10.06.2019","start_time":"19:00","end_time":"20:00"},{"locale":"de","title":"M.A.X / Pump Mix","css_class":"m-a-x-pump-mix kursraum-ug","highlight_id":"m-a-x-pump-mix","blendout_id":"_gup0137cf8bk3330k4218k9558k19b06d229841 _gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup78a0ba48k3ba8k40a4k8527k57e08fe73377","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2019-12-26T09:30:00","end":"2019-12-26T10:30:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/fitwork.ch/thumb_1176x882_cxworx2.jpg' alt='M.A.X / Pump Mix' title='M.A.X / Pump Mix' /\u003e","teaser_text":"M.A.X /Pump Mix","trainer":"Tamara","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/m-a-x-pump-mix-kursraum-ug-thu-09-30-10-30.html","page_linked_url":"","dow":"","day_integer":4,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":0,"excluded_dates":"","start_time":"09:30","end_time":"10:30"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup6003c28ck1504k4517ka9f4ke6144f8f2771","day":"Mon","editable":false,"day_text":"Montag","start":"2019-06-10T09:15:00","end":"2019-06-10T10:15:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-mon-09-15-10-15.html","page_linked_url":"","dow":"","day_integer":1,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":0,"excluded_dates":"","start_time":"09:15","end_time":"10:15"},{"locale":"de","title":"CXWorx","css_class":"cxworx kursraum-ug","highlight_id":"cxworx","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup3dd3edfek6d44k451ck8436ka8be588b118d","day":"Fri","editable":false,"day_text":"Freitag","start":"2015-01-09T18:00:00","end":"2015-01-09T18:30:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining59.jpg' alt='CXWorx' title='CXWorx' /\u003e","teaser_text":"30 Minuten für den Rumpf. Hol dir dein Sixpack und funktionelle Kraft für Sport und Alltag","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/cxworx-kursraum-ug-fri-18-00-18-30-0.html","page_linked_url":"","dow":[5],"day_integer":5,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"28.06.2019,05.07.2019,23.08.2019,30.08.2019,06.09.2019,13.09.2019,20.09.2019,27.09.2019,04.10.2019,11.10.2019,18.10.2019,25.10.2019,01.11.2019,08.11.2019,15.11.2019,22.11.2019,29.11.2019,06.12.2019,13.12.2019,20.12.2019,27.12.2019","start_time":"18:00","end_time":"18:30"}];

            if (typeof courses_initial[0] != 'undefined') {
              start_cal_at = moment(courses_initial[0]['start']);
              end_cal_at = moment(courses_initial[0]['end']);
            }else {
              start_cal_at = moment('2015-01-01T00:00:00');
              end_cal_at = moment('2015-01-01T16:00:00');
            }

            for (i=0; i<24; i++) {
              show_times[i] = false;
            }
            var start;
            var end;

            courses_initial.forEach(function(entry){
                /* Set times that show be shown on calendar */
                start = moment(entry['start']).hours();
                end = moment(entry['end']).hours() + 1;/*Fix error in course_view*/
                for (i=start; i<=end; i++) {
                    show_times[i] = true;
                }

                if (moment(entry['start']).hours() < start_cal_at.hours()) {
                    start_cal_at = moment(entry['start']).minutes(0);
                }
                if (moment(entry['end']).hours() >= end_cal_at.hours()) {
                    if (moment(entry['end']).minutes() != 0) {
                        end_cal_at = moment(entry['end']).add(1, 'hours').minutes(0);
                    }else {
                        end_cal_at = moment(entry['end']).minutes(0);
                    }
                }
            });

            if (end_cal_at.hours() - start_cal_at.hours() <= 14) {
                slotDuration = '00:15:00';
            }

            cal_start = start_cal_at.minute(0).format('HH:mm:ss');
            cal_end = end_cal_at.minute(0).format('HH:mm:ss')
            if (end_cal_at.minute(0).format('HH:mm:ss') == '00:00:00') {
                cal_end = end_cal_at.hours(23).minute(59);
            }

            $('#course_calendar').fullCalendar({
                lang: currentLangCode,
                header: {
                    left: 'prev,next,today',
                    right: 'agendaWeek,agendaDay'
                },
                defaultDate: moment(),
                defaultView: view,
                allDaySlot: true,
                editable: false,
                firstHour: 6,
                axisFormat: 'HH:mm',
                minTime: cal_start,
                maxTime: cal_end,
                slotDuration: slotDuration,
                columnFormat: {
                    week: 'dd. DD.MM.YYYY',
                    day: 'dd. DD.MM.YYYY'
                },
                height: '200px',
                events: [{"locale":"de","title":"Cycling ","css_class":"cycling kursraum-ug","highlight_id":"cycling","blendout_id":"_gup0137cf8bk3330k4218k9558k19b06d229841","id":"_gup0492e18bk846ek4913kb9b6kc783e40099e8","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T12:10:00","end":"2015-01-05T13:00:00","backgroundColor":"#ac0e0e","borderColor":"#ac0e0e","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/indoorcycling/s/indoor_cycling11.jpg' alt='Cycling ' title='Cycling ' /\u003e","teaser_text":"Animierendes Cycling-Training im Intervallformat","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/cycling-kursraum-ug-mon-12-10-13-00-0.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"09.07.2018,16.07.2018,23.07.2018,30.07.2018,06.08.2018,13.08.2018,24.12.2018,31.12.2018,04.03.2019,22.04.2019,10.06.2019,08.07.2019,15.07.2019,22.07.2019,29.07.2019,05.08.2019,12.08.2019,19.08.2019,26.08.2019","start_time":"12:10","end_time":"13:00"},{"locale":"de","title":"Five","css_class":"five kursraum-ug","highlight_id":"five","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gupc54746bdka9d3k4211k83afk0adabbf7d136","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T19:00:00","end":"2015-01-05T19:45:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining62.jpg' alt='Five' title='Five' /\u003e","teaser_text":"Rumpftraining, welches sowohl Übungen für einen starken Rücken sowie Bauch \u0026amp; Beckenboden beinhaltet.","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/five-kursraum-ug-mon-19-00-19-45.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"05.06.2017,25.12.2017,01.01.2018,12.02.2018,02.04.2018,21.05.2018,24.12.2018,31.12.2018,04.03.2019,22.04.2019,10.06.2019","start_time":"19:00","end_time":"19:45"},{"locale":"de","title":"Painlessmotion (neu)","css_class":"painlessmotion kursraum-ug","highlight_id":"painlessmotion","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup31a188d3kccbfk4f34kbefdkab256094d9fe","day":"Tue","editable":false,"day_text":"Dienstag","start":"2015-01-06T08:00:00","end":"2015-01-06T09:00:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining14.jpg' alt='Painlessmotion' title='Painlessmotion' /\u003e","teaser_text":"Beweglichkeitstraining nach Phil.Dr. Axel Daase","trainer":"","level":"","icons":"","new":1,"canceled":0,"url_slug":"kurse/painlessmotion-kursraum-ug-tue-08-00-09-00-0.html","page_linked_url":"","dow":[2],"day_integer":2,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2017,26.12.2017,02.01.2018,13.02.2018,25.12.2018,01.01.2019,05.03.2019,31.12.2019","start_time":"08:00","end_time":"09:00"},{"locale":"de","title":"Fit \u0026 Zwäg","css_class":"fit-zwag kursraum-ug","highlight_id":"fit-zwag","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup9aa3dee4k7021k4090k8963k2ebbcdd8bf81","day":"Tue","editable":false,"day_text":"Dienstag","start":"2015-01-06T09:00:00","end":"2015-01-06T10:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining26.jpg' alt='Fit \u0026 Zwäg' title='Fit \u0026 Zwäg' /\u003e","teaser_text":"Das optimale Ganzkörperworkout","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/fit-zwag-kursraum-ug-tue-09-00-10-00-0.html","page_linked_url":"","dow":[2],"day_integer":2,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"03.04.2018,10.04.2018,10.07.2018,17.07.2018,24.07.2018,31.07.2018,07.08.2018,14.08.2018,25.12.2018,05.02.2019,26.02.2019,05.03.2019,09.07.2019,16.07.2019,23.07.2019,30.07.2019,06.08.2019,13.08.2019,01.10.2019,08.10.2019,31.12.2019","start_time":"09:00","end_time":"10:00"},{"locale":"de","title":"Pilates","css_class":"pilates kursraum-ug","highlight_id":"pilates","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup1b4040f1k513fk4c48k97ffk506580a5eef2","day":"Tue","editable":false,"day_text":"Dienstag","start":"2015-01-06T10:00:00","end":"2015-01-06T11:00:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/pilates/s/pilates01.jpg' alt='Pilates' title='Pilates' /\u003e","teaser_text":"Ein ganzheitliches Körpertraining","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/pilates-kursraum-ug-tue-10-00-11-00-0.html","page_linked_url":"","dow":[2],"day_integer":2,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2017,26.12.2017,02.01.2018,13.02.2018,25.12.2018,01.01.2019,05.03.2019,24.12.2019,31.12.2019","start_time":"10:00","end_time":"11:00"},{"locale":"de","title":"Bauchintensiv","css_class":"bauchintensiv kursraum-ug","highlight_id":"bauchintensiv","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup007e1708kdd8ek4f65kabdbk5a301b78fd69","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T08:45:00","end":"2015-01-07T09:15:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining44.jpg' alt='Bauchintensiv' title='Bauchintensiv' /\u003e","teaser_text":"30 Minuten für den Rumpf. Hol dir dein Sixpack und funktionelle Kraft für Sport und Alltag.","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bauchintensiv-kursraum-ug-wed-08-45-09-15-0.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.11.2017,01.08.2018,15.08.2018,26.12.2018,02.01.2019,25.12.2019,01.01.2020","start_time":"08:45","end_time":"09:15"},{"locale":"de","title":"M.A.X./Toning","css_class":"m-a-x-toning kursraum-ug","highlight_id":"m-a-x-toning","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupfc13e7b1kf798k4722k9bb0kd10d7fe87ec3","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T09:15:00","end":"2015-01-07T10:15:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/figur/s/figur13.jpg' alt='M.A.X./Toning' title='M.A.X./Toning' /\u003e","teaser_text":"Der ganze Körper wird gekräftigt und gestrafft mit diversen Hilfsmitteln.","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/m-a-x-toning-kursraum-ug-wed-09-15-10-15-0.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.11.2017,01.08.2018,15.08.2018,25.12.2019,01.01.2020","start_time":"09:15","end_time":"10:15"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup1723c04akcd0fk44d8k8163k3ddf1be17228","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T18:00:00","end":"2015-01-07T19:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-wed-18-00-19-00.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2018,15.08.2018,26.12.2018,02.01.2019,25.12.2019,01.01.2020","start_time":"18:00","end_time":"19:00"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupa5f7d331k2970k4d96kaf82k9428222c83c3","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2015-01-08T09:00:00","end":"2015-01-08T10:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining80.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-thu-09-00-10-00.html","page_linked_url":"","dow":[4],"day_integer":4,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"30.05.2019,20.06.2019,01.08.2019,15.08.2019,26.12.2019,02.01.2020","start_time":"09:00","end_time":"10:00"},{"locale":"de","title":"Five","css_class":"five kursraum-ug","highlight_id":"five","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup415df499k8e04k4a2ak8a4ekc1e5ef966131","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2015-01-08T10:00:00","end":"2015-01-08T10:45:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining45.jpg' alt='Five' title='Five' /\u003e","teaser_text":"Das optimale Ganzkörperworkout","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/five-kursraum-ug-thu-10-00-10-45.html","page_linked_url":"","dow":[4],"day_integer":4,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"30.05.2019,20.06.2019,01.08.2019,15.08.2019,26.09.2019,26.12.2019,02.01.2020","start_time":"10:00","end_time":"10:45"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup9950b47ck8033k4d62kabc7k0c77ad3e7c90","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2015-01-08T12:10:00","end":"2015-01-08T13:10:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-thu-12-10-13-10-0.html","page_linked_url":"","dow":[4],"day_integer":4,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"30.05.2019,20.06.2019,01.08.2019,15.08.2019,26.12.2019,02.01.2020","start_time":"12:10","end_time":"13:10"},{"locale":"de","title":"Body \u0026 Soul","css_class":"body-soul kursraum-ug","highlight_id":"body-soul","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gupf59843ack12eek4dadkaa12k2fbc433dc06b","day":"Fri","editable":false,"day_text":"Freitag","start":"2015-01-09T09:00:00","end":"2015-01-09T10:00:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining38.jpg' alt='Body \u0026 Soul' title='Body \u0026 Soul' /\u003e","teaser_text":"Yoga, Pilates, Tai Chi und Stretching BodyBALANCE bringt Atmung, Bewegung, Anspannung und Entspannung.","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/body-soul-kursraum-ug-fri-09-00-10-00.html","page_linked_url":"","dow":[5],"day_integer":5,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"14.04.2017,30.03.2018,19.04.2019","start_time":"09:00","end_time":"10:00"},{"locale":"de","title":"Five","css_class":"five kursraum-eg","highlight_id":"five","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gupe66bddc7k8959k4f66k8aa8k710406478613","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T18:00:00","end":"2015-01-07T18:45:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining09.jpg' alt='Five' title='Five' /\u003e","teaser_text":"Das optimale Ganzkörperworkout","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/five-kursraum-eg-wed-18-00-18-45-0.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2018,15.08.2018,26.12.2018,02.01.2019,25.12.2019,01.01.2020","start_time":"18:00","end_time":"18:45"},{"locale":"de","title":"Painlessmotion (neu)","css_class":"painlessmotion kursraum-eg","highlight_id":"painlessmotion","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup71b4aac6k6891k4f3bk8f02k820fd4f8c0f6","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2015-01-08T19:00:00","end":"2015-01-08T19:45:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining38.jpg' alt='Painlessmotion' title='Painlessmotion' /\u003e","teaser_text":"Das optimale Ganzkörperworkout","trainer":"","level":"","icons":"","new":1,"canceled":0,"url_slug":"kurse/painlessmotion-kursraum-eg-thu-19-00-19-45-0.html","page_linked_url":"","dow":[4],"day_integer":4,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"30.05.2019,20.06.2019,01.08.2019,15.08.2019,26.09.2019,02.01.2020,06.02.2020,26.12.2019","start_time":"19:00","end_time":"19:45"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupfe6744b6k8bd5k4822kbd88kf0e361c63c11","day":"Sat","editable":false,"day_text":"Samstag","start":"2015-01-10T09:15:00","end":"2015-01-10T10:15:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining80.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-sat-09-15-10-15.html","page_linked_url":null,"dow":[6],"day_integer":6,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":0,"excluded_dates":"","start_time":"09:15","end_time":"10:15"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup0aac10a3kff32k4ef7kba89k498e13e11e64","day":"Sun","editable":false,"day_text":"Sonntag","start":"2015-01-11T10:00:00","end":"2015-01-11T11:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-sun-10-00-11-00.html","page_linked_url":"","dow":[0],"day_integer":0,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"21.04.2019,09.06.2019","start_time":"10:00","end_time":"11:00"},{"locale":"de","title":"CXWorx/Toning","css_class":"cxworx-toning kursraum-eg","highlight_id":"cxworx-toning","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupafddc02dk29edk4cc7ka0f3k1f108a2afe88","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T18:00:00","end":"2015-01-05T19:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining41.jpg' alt='CXWorx/Toning' title='CXWorx/Toning' /\u003e","teaser_text":"Ganz Körpertraining","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/cxworx-toning-kursraum-eg-mon-18-00-19-00-0.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":0,"places":null,"has_excluded_dates":1,"excluded_dates":"25.12.2017,01.01.2018,12.02.2018,02.04.2018,21.05.2018,24.12.2018,31.12.2018,04.03.2019,22.04.2019,10.06.2019,08.07.2019,15.07.2019,22.07.2019,29.07.2019,05.08.2019,12.08.2019","start_time":"18:00","end_time":"19:00"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup1bca3715k70a8k4b8fk9180kf0b6168dd350","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T09:00:00","end":"2015-01-05T10:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-mon-09-00-10-00.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"04.03.2019,22.04.2019,10.06.2019","start_time":"09:00","end_time":"10:00"},{"locale":"de","title":"special","css_class":"special kursraum-ug","highlight_id":"special","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupb91757a4kd4dek4ab6k898fk3db1fc3f31c3","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2020-01-02T09:30:00","end":"2020-01-02T11:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='special' title='special' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/special-kursraum-ug-thu-09-30-11-00-0.html","page_linked_url":"","dow":"","day_integer":4,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":0,"excluded_dates":"","start_time":"09:30","end_time":"11:00"},{"locale":"de","title":"Yoga","css_class":"yoga kursraum-eg","highlight_id":"yoga","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup959ae473kab73k4e08kb672kbcee61fd408c","day":"Wed","editable":false,"day_text":"Mittwoch","start":"2015-01-07T19:00:00","end":"2015-01-07T20:15:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/xs/gruppentraining09.jpg' alt='Yoga' title='Yoga' /\u003e","teaser_text":"Yoga (Bhaktiyoga)\r\nRichtig beigebrachte Ananas (Körperübungen) führen kurz- und langfristig zu mehr Vitalität, Fitness und Gesundheit auf körperlicher sowie geistiger Ebene.","trainer":"Martina","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/yoga-kursraum-eg-wed-19-00-20-15.html","page_linked_url":"","dow":[3],"day_integer":3,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"01.08.2018,15.08.2018,26.12.2018,02.01.2019,25.12.2019,01.01.2020","start_time":"19:00","end_time":"20:15"},{"locale":"de","title":"Cycling ","css_class":"cycling kursraum-ug","highlight_id":"cycling","blendout_id":"_gup0137cf8bk3330k4218k9558k19b06d229841","id":"_gup67865b58k18a6k49c4kbecek2f7357b198f9","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T18:00:00","end":"2015-01-05T18:45:00","backgroundColor":"#ac0e0e","borderColor":"#ac0e0e","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/indoorcycling/s/indoor_cycling11.jpg' alt='Cycling ' title='Cycling ' /\u003e","teaser_text":"Animierendes Cycling-Training im Intervallformat","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/cycling-kursraum-ug-mon-18-00-18-45-0.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"21.05.2018,09.07.2018,16.07.2018,23.07.2018,30.07.2018,06.08.2018,13.08.2018,31.12.2018,24.12.2018,04.03.2019,22.04.2019,10.06.2019,08.07.2019,15.07.2019,22.07.2019,29.07.2019,05.08.2019,12.08.2019,19.08.2019,26.08.2019","start_time":"18:00","end_time":"18:45"},{"locale":"de","title":"Yoga","css_class":"yoga kursraum-eg","highlight_id":"yoga","blendout_id":"_gupc5d1ca3ak1df9k4561kb3deka6bee0392420","id":"_gup17069246k330ek478dka091k08d7d24215f7","day":"Fri","editable":false,"day_text":"Freitag","start":"2015-01-09T12:10:00","end":"2015-01-09T13:05:00","backgroundColor":"#38b140","borderColor":"#38b140","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/xs/gruppentraining09.jpg' alt='Yoga' title='Yoga' /\u003e","teaser_text":"Yoga (Bhaktiyoga)\r\nRichtig beigebrachte Ananas (Körperübungen) führen kurz- und langfristig zu mehr Vitalität, Fitness und Gesundheit auf körperlicher sowie geistiger Ebene.","trainer":"Martina","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/yoga-kursraum-eg-fri-12-10-13-05-0.html","page_linked_url":"","dow":[5],"day_integer":5,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"13.12.2018,28.12.2018,04.01.2019,01.03.2019,19.04.2019,03.01.2020","start_time":"12:10","end_time":"13:05"},{"locale":"de","title":"CXWorx (neu)","css_class":"cxworx kursraum-ug","highlight_id":"cxworx","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup5b466b0ak30e6k403eka1fdk3da866903f8b","day":"Tue","editable":false,"day_text":"Dienstag","start":"2015-01-06T18:00:00","end":"2015-01-06T18:30:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining44.jpg' alt='CXWorx' title='CXWorx' /\u003e","teaser_text":"30 Minuten für den Rumpf. Hol dir dein Sixpack und funktionelle Kraft für Sport und Alltag.","trainer":"","level":"","icons":"","new":1,"canceled":0,"url_slug":"kurse/cxworx-kursraum-ug-tue-18-00-18-30-0.html","page_linked_url":"","dow":[2],"day_integer":2,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"05.03.2019,22.10.2019,24.12.2019,31.12.2019","start_time":"18:00","end_time":"18:30"},{"locale":"de","title":"BodyPump (neu)","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gupe216c2cck2781k4524k9476kff0839c77c24","day":"Mon","editable":false,"day_text":"Montag","start":"2015-01-05T19:00:00","end":"2015-01-05T20:00:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":1,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-mon-19-00-20-00-0.html","page_linked_url":"","dow":[1],"day_integer":1,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"04.03.2019,22.04.2019,10.06.2019","start_time":"19:00","end_time":"20:00"},{"locale":"de","title":"M.A.X / Pump Mix","css_class":"m-a-x-pump-mix kursraum-ug","highlight_id":"m-a-x-pump-mix","blendout_id":"_gup0137cf8bk3330k4218k9558k19b06d229841 _gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup78a0ba48k3ba8k40a4k8527k57e08fe73377","day":"Thu","editable":false,"day_text":"Donnerstag","start":"2019-12-26T09:30:00","end":"2019-12-26T10:30:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/fitwork.ch/thumb_1176x882_cxworx2.jpg' alt='M.A.X / Pump Mix' title='M.A.X / Pump Mix' /\u003e","teaser_text":"M.A.X /Pump Mix","trainer":"Tamara","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/m-a-x-pump-mix-kursraum-ug-thu-09-30-10-30.html","page_linked_url":"","dow":"","day_integer":4,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":0,"excluded_dates":"","start_time":"09:30","end_time":"10:30"},{"locale":"de","title":"BodyPump","css_class":"bodypump kursraum-ug","highlight_id":"bodypump","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup6003c28ck1504k4517ka9f4ke6144f8f2771","day":"Mon","editable":false,"day_text":"Montag","start":"2019-06-10T09:15:00","end":"2019-06-10T10:15:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/hanteltraining/s/hanteltraining50.jpg' alt='BodyPump' title='BodyPump' /\u003e","teaser_text":"Das Original-Ganzkörper-Workout aus Neuseeland!","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/bodypump-kursraum-ug-mon-09-15-10-15.html","page_linked_url":"","dow":"","day_integer":1,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":0,"excluded_dates":"","start_time":"09:15","end_time":"10:15"},{"locale":"de","title":"CXWorx","css_class":"cxworx kursraum-ug","highlight_id":"cxworx","blendout_id":"_gup902a9e0ak5530k41fakb13fk685841a15677","id":"_gup3dd3edfek6d44k451ck8436ka8be588b118d","day":"Fri","editable":false,"day_text":"Freitag","start":"2015-01-09T18:00:00","end":"2015-01-09T18:30:00","backgroundColor":"#3647b9","borderColor":"#3647b9","textColor":"#ffffff","preview_icons":"","preview_image":"\u003cimg src='/media/media-db/img-kms-db/de/gruppentraining/s/gruppentraining59.jpg' alt='CXWorx' title='CXWorx' /\u003e","teaser_text":"30 Minuten für den Rumpf. Hol dir dein Sixpack und funktionelle Kraft für Sport und Alltag","trainer":"","level":"","icons":"","new":0,"canceled":0,"url_slug":"kurse/cxworx-kursraum-ug-fri-18-00-18-30-0.html","page_linked_url":"","dow":[5],"day_integer":5,"has_schedule":null,"bookable":null,"places":null,"has_excluded_dates":1,"excluded_dates":"28.06.2019,05.07.2019,23.08.2019,30.08.2019,06.09.2019,13.09.2019,20.09.2019,27.09.2019,04.10.2019,11.10.2019,18.10.2019,25.10.2019,01.11.2019,08.11.2019,15.11.2019,22.11.2019,29.11.2019,06.12.2019,13.12.2019,20.12.2019,27.12.2019","start_time":"18:00","end_time":"18:30"}],
                eventRender: function(event, element, view) {

                    var view_start = moment.utc($('#course_calendar').fullCalendar('getView').intervalStart).local().startOf('day');
                    var view_end = moment.utc($('#course_calendar').fullCalendar('getView').intervalEnd).local().startOf('day');

                    //* get all hidden dates for event - make a ajax call for the event
                    if (event.has_excluded_dates == 1){
                        var excluded_dates = event.excluded_dates.split(',');

                        for (var i = 0; i < excluded_dates.length; i++) {

                            var hidden_date = moment(excluded_dates[i], "DD.MM.YYYY");

                            if (hidden_date >= view_start && hidden_date < view_end) {
                                element.hide();
                            }
                        }
                    }

                    if(event.canceled == 1){
                        element.css("text-decoration", "line-through");
                    }
                    var html = '<div class="course-icons">' + event.preview_icons + '</div>';
                    element.append(html);

                },
                eventAfterRender: function(event, element, view) {

                },
                eventMouseover:  function(course, jsEvent, view) {
                    if(course.new == 1){
                        $('.fullcalendar_popup').addClass('new')
                    }else {
                        $('.fullcalendar_popup').removeClass('new')
                    }

                    if(course.canceled == 1) {
                        $(".course_canceled").html('<br/><p><strong>Achtung: <strong><br/>Dieser Kurs entfällt</p>');
                    }else {
                        $(".course_canceled").html('');
                    }

                    $('.course_preview_image').html(course.preview_image);
                    $('.couse_day_time').html(course.day_text + ", " + course.start.format('HH:mm') + " - " + course.end.format('HH:mm') + " Uhr");
                    $('.course_headline').html(course.title);
                    $('.course_teaser').html(course.teaser_text);

                    if (course.trainer != "") {
                        $('.course_trainer').html("<strong>Trainer: </strong>" + course.trainer);
                    }else {
                        $('.course_trainer').html("");
                    }

                    if (course.level != "") {
                        $('.course_level').html("<strong>Level: </strong>" + course.level);
                    }else {
                        $('.course_level').html("");
                    }

                    $('.course_category_images').html(course.icons);
                    $('.course_more_link').attr('href', course.url_slug + '?category_id=_gupe594400bk96a4k4d70k9e8bk4acc48465a06' + '&start=' + course.start.utc().format('YYYY-MM-DD'));
                    $('.course_more_link').attr('title', course.title + " Details");

                    var wd_value = "4";
                    var wd_type = "weeks";
                    var end_date = moment().add(parseInt(wd_value) , wd_type);

                    /* Registration options */
                    if (course.bookable == 1 && course.canceled != 1 && moment().utc() < course.start.utc() && course.start.utc() < end_date) {
                        $('.course_register_link').show();

                        var day = course.start.utc().format('LL');

                        $('#register_modal .course_title').html(course.title);
                        $('#register_modal .time .day').html(course.day_text + ', ' + day);
                        $('#register_modal .time .from_to').html(course.start.format('HH:mm') + " - " + course.end.format('HH:mm'));

                        $('form#register #course_id').attr('value', course.id);
                        $('form#register #name').attr('value', course.title);
                        $('form#register #date').attr('value', course.start.utc().format('YYYY-MM-DD'));
                        $('form#register #day').attr('value', course.day);
                        $('form#register #start').attr('value', course.start.format('HH:mm'));
                        $('form#register #end').attr('value', course.end.format('HH:mm'));

                    }else {
                        $('.course_register_link').hide();
                    }

                    if (course.bookable == 1 && course.canceled != 1 && moment().utc() < course.start.utc() && course.start.utc() < end_date){

                        var free_places = 0;
                        $.ajax({
                            type: "GET",
                            url: "courses/get_taken_places",
                            data: {course_id: course.id, date: course.start.utc().format('YYYY-MM-DD'), day: course.day, start: course.start.format('HH:mm'), end: course.end.format('HH:mm')},
                            async: false,
                            dataType: "json",
                            success: function(data) {
                                free_places = course.places - data.taken_places;
                            }
                        });

                        if (free_places > 0) {
                            $('.places').html("<strong>Freie Plätze: </strong>" + free_places);
                            $('.course_register_link').show();
                        }else {
                            $('.places').html("<strong>Freie Plätze: </strong>" + " ausgebucht ");
                            $('.course_register_link').hide();
                        }
                    }else {
                        $('.places').html("");
                    }

                    $(".fullcalendar_popup").hide();

                    setTimeout(function(){
                        $(".fullcalendar_popup").addClass("fading");
                        $(".fullcalendar_popup").fadeIn(1000, function() {
                            $(".fullcalendar_popup").removeClass("fading");
                        });

                        if ($(window).width() < 786){
                            pos_left = ($(window).width() - $(".fullcalendar_popup").width()) / 2;
                            $(".fullcalendar_popup").offset({ top: jsEvent.pageY, left: pos_left });
                        }else {
                            if (jsEvent.pageX-$(".courses").position()['left'] > ($("#course_calendar").width()/2)){

                                if (jsEvent.pageY200-$(".courses").position()['top'] > ($("#course_calendar").height()/2)){
                                    pos_top = jsEvent.pageY - $(".fullcalendar_popup").width();
                                }else {
                                    pos_top = jsEvent.pageY;
                                }

                                pos_left = jsEvent.pageX - $(".fullcalendar_popup").width();
                                $(".fullcalendar_popup").offset({ top: pos_top, left: pos_left });
                            }else {

                                if (jsEvent.pageY-200-$(".courses").position()['top'] > ($("#course_calendar").height()/2)){
                                    pos_top = jsEvent.pageY - $(".fullcalendar_popup").width();
                                }else {
                                    pos_top = jsEvent.pageY;
                                }

                                $(".fullcalendar_popup").offset({ top: pos_top, left: jsEvent.pageX });
                            }
                        }

                    }, 700);

                },
                viewRender: function(view) {
                    start = view.start.format('DD.MM.YYYY');
                },
                dayRender: function(date, cell) {
                    hide_times();
                }

            });
        }

        renderCalendar('agendaWeek');
        check_view();
    });

    $( window ).resize(function() {
        check_view();
    });

    function hide_times() {
        var hour;
        var element;

        $('.fc-time').first().find('span').css('font-weight', 'bold');
        $('.fc-time').first().parent().css('background-color', '#EFEFEF');
        $('.fc-axis.fc-widget-content').first().html('');

        if (slotDuration == '00:30:00') {

            for (i=start_cal_at.hours(); i<=end_cal_at.hours(); i++) {
                if (show_times[i] == false) {
                    hour = moment("2015-01-05").hours(i).format('HH:mm');
                    element = $( ".fc-slats span:contains('" + hour +"')" );
                    element.parent().parent().hide();
                    element.parent().parent().next().hide();
                    element.parent().parent().next().next().find('td span').css('font-weight', 'bold');
                    element.parent().parent().next().next().css('background-color', '#EFEFEF');
                }
            }
        }else {
            for (i=start_cal_at.hours(); i<=end_cal_at.hours(); i++) {
                if (show_times[i] == false) {
                    hour = moment("2015-01-05").hours(i).format('HH:mm');
                    element = $( ".fc-slats span:contains('" + hour +"')" );
                    element.parent().parent().hide();
                    element.parent().parent().next().hide();
                    element.parent().parent().next().next().hide();
                    element.parent().parent().next().next().next().hide();
                    element.parent().parent().next().next().next().next().find('td span').css('font-weight', 'bold');
                    element.parent().parent().next().next().next().next().css('background-color', '#EFEFEF');
                }
            }
        }
    }

    function check_view(){
        if ($(window).width() < 768){
            $('#course_calendar').fullCalendar( 'changeView', 'agendaDay' );
            $('.fc-agendaWeek-button').hide();
            $('#course_calendar').fullCalendar('option', 'height', 600);
        } else {
            $('#course_calendar').fullCalendar( 'changeView', 'agendaWeek' );
            $('.fc-agendaWeek-button').show();
            $('#course_calendar').fullCalendar('option', 'height', 'auto');
        }
    }

    $.urlParam = function(name, url){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
        if (results==null) {
          return null;
        }
        else {
          return results[1] || 0;
        }
    }
