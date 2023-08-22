package alpine.api.v1.email.utils;

public class EmailUtil {
    public static String getUrl(String host, String uri) {
        return String.format("%s/api/%s", host, uri);
    }

    public static String getHeader(String name) {
        return String.format("Hello %s,\n\n", name);
    }

    public static String getFooter() {
        return "\n\nThe Support Team.";
    }
}
