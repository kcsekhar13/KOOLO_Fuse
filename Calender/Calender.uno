using Uno;
using Uno.Collections;
using Fuse.Scripting;
using Fuse.Reactive;
using Fuse;
using Uno.Compiler.ExportTargetInterop;
using Uno.Threading;

public class Calendar : NativeModule {

  public Calendar(){
    if defined(iOS) {
      AddMember(new NativeFunction("getDate", (NativeCallback)iOSGetDateString));
    }
    if defined(Android) {
      AddMember(new NativeFunction("getDate",(NativeCallback)AndroidGetDateString));
    }
    if defined(!Android && !iOS) {
      AddMember(new NativeFunction("getDate", LocalGetDateString));
    }
  }
  // iOS
  extern(iOS) public object iOSGetDateString(Context c, object[] args) {
    return "2016/04/01";
  }
  // Android
  extern(Android) public object AndroidGetDateString(Context c, object[] args) {
     var date = CalendarImpl.GetDate();
     return date;
  }
  // Local
	extern public object LocalGetDateString(Context c, object[] args) {
		return "2016/04/01";
	}
}

[ForeignInclude(Language.Java,
                "android.app.Activity",
                "android.content.Intent",
                "android.app.DatePickerDialog",
                "java.util.Calendar",
                "java.util.Date",
                "java.util.Locale",
                "java.util.TimeZone",
                "java.text.SimpleDateFormat",
                "android.widget.DatePicker")]
public class CalendarImpl
{
  static string Date;

  public static string GetDate () {
    Date = GetDateImpl();
    return Date;
  }

  [Foreign(Language.Java)]
	static extern(Android) string GetDateImpl ()
	@{
    SimpleDateFormat mStorageDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'00:00:00.000Z", Locale.US);
    DatePickerDialog.OnDateSetListener dateSetListener = new DatePickerDialog.OnDateSetListener() {
           @Override
           public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
               Calendar calendar = Calendar.getInstance();
               calendar.set(year, monthOfYear, dayOfMonth);
               return mStorageDateFormat.format(calendar.getTime()));
           }
       };

       Calendar calendar = Calendar.getInstance();
       try {
           calendar.setTime(mStorageDateFormat.format(date););
       }
       catch (Exception e) {
           e.printStackTrace();
       }

       DatePickerDialog pickerDialog = new DatePickerDialog(getContext(), dateSetListener,  calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH));
       pickerDialog.setButton(DialogInterface.BUTTON_POSITIVE, "OK", pickerDialog);
       pickerDialog.setButton(DialogInterface.BUTTON_NEGATIVE, "Cancel", pickerDialog);
       pickerDialog.show();
	@}

  static extern(!Mobile) string GetDateImpl () {
		throw new Fuse.Scripting.Error("Unsupported platform");
	}

  [Foreign(Language.ObjC)]
  static extern(iOS) string GetDateImpl ()
  @{
      return "";

  @}
}
