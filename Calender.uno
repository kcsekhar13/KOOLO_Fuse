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
                "android.provider.CalendarContract",
								"android.provider.CalendarContract.Events",
								"java.util.Calendar"
                )]
public class CalenderImpl
 {
  static int Year {get;set;}
  static int Month {get;set;}
  static int Day {get;set;}
  static int Hour {get;set;}
	static int Minute {get;set;}
	static bool IsRecurring {get;set;}

  public static void AddCalenderEvent(int year,int month,int day,int hour,int minute,bool isRecurring)
	{
		Year =year;
		Month=month;
		Day=day;
		Hour=hour;
		Minute=minute;
		IsRecurring = isRecurring;
		AddEvent();
  }

	static extern(!Mobile) void AddEvent () {
		throw new Fuse.Scripting.Error("Unsupported platform");
	}

  [Foreign(Language.Java)]
  static extern(Android) void AddEvent(){
    @{
			Activity a = com.fuse.Activity.getRootActivity();
      Calendar beginTime = Calendar.getInstance();
      beginTime.set(2016, 5, 02, 13, 30);
      Calendar endTime = Calendar.getInstance();
    	endTime.set(2016, 5, 02, 15, 30);
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
}
