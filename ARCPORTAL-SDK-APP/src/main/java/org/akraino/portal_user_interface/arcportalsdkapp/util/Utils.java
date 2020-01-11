package org.akraino.portal_user_interface.arcportalsdkapp.util;

import org.json.JSONException;
import org.json.JSONObject;

public final class Utils {

    public static String constructJsonErrorMessage(String error) {
        try {
            new JSONObject(error);
            return error;
        } catch (JSONException err) {
            return "{\"message\":\"" + error + "\"}";
        }
    }
}
