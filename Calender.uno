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
      return null;
  }
}

[extern(Android) ForeignInclude(Language.Java,
                "android.app.Activity",
                "android.content.Intent",
                "android.net.Uri",
                "android.provider",
                "android.os.Bundle",
                "android.provider.CalendarContract",
                )]
public class CalenderImpl {
  static int Year;
  static int Month;
  static int Day;
  static int Time;

  public static void AddCalenderEvent(string dateTime){

  }

  [Foreign(Language.Java)]
  static extern(Android) void Add(){
    @{
      Calendar beginTime = Calendar.getInstance();
      beginTime.set(Year, Month, Day, Time, 00);
      Calendar endTime = Calendar.getInstance();
      endTime.set(Year, Month, Day, Time, 30);
      Intent intent = new Intent(Intent.ACTION_INSERT)
              .setData(Events.CONTENT_URI)
              .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, beginTime.getTimeInMillis())
              .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, endTime.getTimeInMillis())
              .putExtra(Events.TITLE, "KOOLO Event")
              .putExtra(Events.DESCRIPTION, "KOOLO Event")
              .putExtra(Events.AVAILABILITY, Events.AVAILABILITY_BUSY);
      startActivity(intent)
    @}
  }
}
