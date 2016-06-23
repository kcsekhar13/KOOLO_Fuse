using Uno;
using Uno.Collections;
using Fuse.Scripting;
using Fuse.Reactive;
using Fuse;
using Uno.Compiler.ExportTargetInterop;
using Uno.Threading;

public class Calender : NativeModule {
	public Calender () {
		// Add Load function to load image as a texture
		AddMember(new NativeFunction("AddEvent", (NativeCallback)AddEvent));

	}
  static object AddEvent(Context c,object[] args)
  {
		debug_log("Adding event : " + args);
		var year = 2016;
		var month = 06;
		var day = 02;
		var hours = 13;
		var minutes= 20;
		var isRecurring = true;
		CalenderImpl.AddCalenderEvent(year,month,day,hours,minutes,isRecurring);
    return null;
  }
}

[extern(Android) ForeignInclude(Language.Java,
                "android.app.Activity",
                "android.content.Intent",
                "android.net.Uri",
                "android.os.Bundle",
								"android.database.Cursor",
                "android.provider.CalendarContract",
								"android.provider.CalendarContract.Events",
								"android.content.ContentResolver",
								"android.widget.Toast",
								"android.content.ContentValues",
								"java.util.Calendar",
								"java.lang.Object",
								"java.util.Date",
								"java.util.TimeZone",
								"java.text.SimpleDateFormat"
                )]
public class CalenderImpl
 {
  static int Year {
		get; set;
	}
  static int Month {get;set;}
  static int Day {get;set;}
  static int Hour {get;set;}
	static int Minute {get;set;}
	static bool IsRecurring {get;set;}

  public static void AddCalenderEvent(int year,int month,int day,int hour,int minute,bool isRecurring)
	{
		Year = year;
		Month = month;
		Day = day;
		Hour = hour;
		Minute = minute;
		IsRecurring = isRecurring;
		AddEventWithIntent(Year,Month,Day,Hour,Minute);
  }

	static extern(!Mobile) void AddEvent () {
		throw new Fuse.Scripting.Error("Unsupported platform");
	}
	[Foreign(Language.Java)]
	static extern(Android) void AddEvent(){
		@{
			 String calendarUriBase = null;
			 Activity a = com.fuse.Activity.getRootActivity();
			Uri eventsUri = null;
			Uri remainderUri = null;
			Cursor cursor = null;
			eventsUri = Uri.parse("content://com.android.calendar/events");
			remainderUri = Uri.parse("content://com.android.calendar/reminders");
			 //Date  eventDate  = null;
			long startCalTime;
			long endCalTime;
			 TimeZone timeZone = TimeZone.getDefault();
				Calendar cal = Calendar.getInstance();
				//eventDate = new SimpleDateFormat("EEE MMM d HH:mm:ss z yyyy").parse("Thr Jun 02 18:30:00 CEST 2016");
				//cal.setTime(eventDate);
				cal.set(Calendar.HOUR_OF_DAY,17);
				cal.set(Calendar.MINUTE, 30);
				startCalTime = cal.getTimeInMillis();

				cal.set(Calendar.HOUR_OF_DAY,18);
				cal.set(Calendar.MINUTE, 30);
				endCalTime = cal.getTimeInMillis();
			 int[] calIds  = null;
				 String[] projection = new String[] {
									 CalendarContract.Calendars._ID,
									 CalendarContract.Calendars.ACCOUNT_NAME};

				 ContentResolver cr = a.getContentResolver();
				 cursor = cr.query(Uri.parse("content://com.android.calendar/calendars"), projection, null, null, null);

				 if (cursor.moveToFirst()) {
								final String[] calNames = new String[cursor.getCount()];
								calIds = new int[cursor.getCount()];
								for (int i = 0; i < calNames.length; i++) {
										calIds[i] = cursor.getInt(0);
										calNames[i] = cursor.getString(1);
										cursor.moveToNext();
								}
						}

				try {

						ContentValues event = new ContentValues();
						event.put(CalendarContract.Events.CALENDAR_ID,1);
						event.put(CalendarContract.Events.TITLE,"KOOLO Event");
						event.put(CalendarContract.Events.DESCRIPTION,"Scheduled Koolo Event");
						event.put(CalendarContract.Events.DTSTART, startCalTime);
						event.put(CalendarContract.Events.DTEND, endCalTime);
						event.put(CalendarContract.Events.STATUS, 1);
						event.put(CalendarContract.Events.HAS_ALARM, 1);
						event.put(CalendarContract.Events.EVENT_TIMEZONE, timeZone.getID());
						// To Insert
						a.getContentResolver().insert(eventsUri, event);

				} catch (Exception e) {
				}
		@}
	}

  [Foreign(Language.Java)]
  static extern(Android) void AddEventWithIntent(int Year, int Month,int Day, int Hour, int Minute){
    @{
			 Activity a = com.fuse.Activity.getRootActivity();
       Calendar beginTime = Calendar.getInstance();
       //beginTime.set( Year ,Month , Day, Hour, Minute);
       Calendar endTime = Calendar.getInstance();
    	 //endTime.set( Year, Month , Day, Hour, Minute + 30);
       Intent intent = new Intent(Intent.ACTION_INSERT)
               .setData(Events.CONTENT_URI)
               .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, beginTime.getTimeInMillis())
               .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, endTime.getTimeInMillis())
               .putExtra(Events.TITLE, "KOOLO Event")
               .putExtra(Events.DESCRIPTION, "KOOLO Event")
               .putExtra(Events.AVAILABILITY, Events.AVAILABILITY_BUSY);
       a.startActivity(intent);
    @}
  }

  static extern(!Mobile) void AddEventWithIntent(int Year, int Month,int Day, int Hour, int Minute){
    throw new Fuse.Scripting.Error("Unsupported platform");
  }


}
